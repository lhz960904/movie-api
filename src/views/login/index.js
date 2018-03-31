import React from 'react'
import axios from "axios" ;
import { Form, Icon, Input, Button, message} from 'antd';
const FormItem = Form.Item;

@Form.create()
export default class Login extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {email, password} = values
        axios({
          method: 'post',
          url: '/api/client/user/login',
          data: {
            email,
            password
          }
        }).then((res) => {
          if (res.data.code == 0) {
            console.log(res.data.data)
            window.location.href = '/movie'
          } else {
            message.error(res.data.errmsg);
          }
        }).catch((err) => {
          message.error('请求失败');
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="form-wrapper">
        <h1>后台登录</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '用户名不能为空' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '密码不能为空' }],
            })(
              <Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              <span>登录</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}