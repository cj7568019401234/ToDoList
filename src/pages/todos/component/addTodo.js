import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Input, DatePicker, TimePicker } from 'antd';
import { actions } from '../../../store/todos/index';
import '../index.css';

const TodoService = require('../../../services/todoServer');
const { Header } = Layout;
const { Search } = Input;
const dateFormat = 'YYYY/MM/DD';
const format = 'HH:mm';

class AddTodo extends React.Component {
    state = {
        value: '',
        endDate: '',
        endTime: '',
    }

    /**
    * 处理导航栏的日期选择器的变化
    *  @param {value} Moment对象
    *  @param {dateString} 格式化后的被选择日期
    */
    handleDatePicker = (value, dateString) => {
        this.setState({ endDate: dateString })
    }

    /**
    * 处理导航栏的时间选择器的变化
    *  @param {time} Moment对象
    *  @param {timeString} 格式化后的被选择时间
    */
    handleTimePicker = (time, timeString) => {
        this.setState({ endTime: timeString });
    };

    /**
     * 处理导航栏的输入框内容发生变化
     *  @param {e} 发生点击事件的Event对象
     */
    handleInput = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    /**
     * 添加新任务
     */
    addTask = () => {
        const { value, endDate, endTime } = this.state
        if (!value.trim()) return; //不允许添加空白任务
        this.props.onAdd(value, false, endDate, endTime);  //发出添加任务的action
        this.setState({ //添加任务后，输入框清空
            value: '',
            endDate: '',
            endTime: '',
        });
    };

    render() {
        const { value } = this.state;
        return (
            <Layout>
                <Header className='nav'>
                    <label className='nav__logo'>❤ TodoList</label>
                    <DatePicker
                        className='nav__date'
                        format={dateFormat}
                        placeholder="请选择截止日期"
                        onChange={this.handleDatePicker}
                    />
                    <TimePicker
                        className='nav__time'
                        format={format}
                        placeholder="请选择截止时间"
                        onChange={this.handleTimePicker}
                    />
                    <div className='nav__input'>
                        <Search
                            placeholder="请输入任务"
                            enterButton="添加"
                            size="middle"
                            onChange={this.handleInput}
                            value={value}
                            onSearch={() => this.addTask()}
                        />
                    </div>
                </Header>
            </Layout>
        );
    }
}

/**
 * 使用PropTypes进行类型检查
 */
AddTodo.propTypes = {
    onAdd: PropTypes.func.isRequired  //指定add函数被传递给组件
}

/**
 * 将需要绑定的响应事件注入到组件上（props上）
 * @param {dispatch}  dispatch() 方法
 */
const mapDispatchToProps = (dispatch) => {
    return {
        onAdd: (text, isFinished, endDate, endTime) => {    //将addTodo这个action 作为 props 绑定到组件中

            //向服务器发起添加待办事项的请求
            TodoService.default.addTodo({ text: text, isFinished: isFinished, endDate: endDate, endTime: endTime })
                .then(() => {
                    TodoService.default.getTodo()   //更新数据为服务器中最新数据
                        .then((todoList) => {
                            dispatch(actions.initTodo(todoList))
                        })
                })
        }
    }
}

export default connect(null, mapDispatchToProps)(AddTodo); //将store和组件联系在一起