import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Input } from 'antd';
import { actions } from '../../../store/todos/index';
import '../index.css';

const { Header } = Layout;
const { Search } = Input;


class AddTodo extends React.Component {
    state = {
        value: ''
    }

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
        const { value } = this.state
        if (!value.trim()) return; //不允许添加空白任务

        this.props.onAdd(value);  //发出添加任务的action

        this.setState({ //添加任务后，输入框清空
            value: '',
        });
    };

    render() {
        return (
            <Layout>
                <Header className='nav'>
                    <label className='nav__logo'>TodoList</label>
                    <div className='nav__input'>
                        <Search
                            placeholder="请输入任务"
                            enterButton="添加"
                            size="middle"
                            onChange={this.handleInput}
                            value={this.state.value}
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
        onAdd: (text) => {    //将addTodo这个action 作为 props 绑定到组件中
            dispatch(actions.addTodo(text))
        }
    }
}

export default connect(null, mapDispatchToProps)(AddTodo); //将store和组件联系在一起