import './View.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
const mockEditor = require('./mockEditor.js')
import { formatTime } from '../../../../common.js';
import ErrMsg from '../../../../components/ErrMsg/ErrMsg.js';
// import { Card } from 'antd'
// import { getMockUrl } from '../../reducer/modules/news.js'

@connect(state=>{
  return {
    curData: state.inter.curdata
  }
})

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true
    }
  }
  static propTypes = {
    curData: PropTypes.object
  }

  req_body_form(req_body_type,req_body_form){
    if(req_body_type === 'json'){
      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div id="vreq_body_json" style={{ minHeight: "300px" }}></div>
      </div>

    }else if(req_body_type === 'form'){

      const columns = [{
        title: '参数名称',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '参数值',
        dataIndex: 'value',
        key: 'value'
      }, {
        title: '备注',
        dataIndex: 'required',
        key: 'required',
        width: '45%'
      }];

      const dataSource = [];
      if(req_body_form&&req_body_form.length){
        req_body_form.map((item,i)=>{
          dataSource.push({
            key: i,
            name: item.name,
            value: item.desc,
            required: item.required?"必须":"非必须"
          })
        })
      }

      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />
      </div>

    }else if(req_body_type === 'file'){

      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div>{this.props.curData.req_body_other}</div>
      </div>

    }else if(req_body_type === 'raw'){

      return <div className="colBody">
        <span className="colKey">请求Body：</span>
        <div>{this.props.curData.req_body_other}</div>
      </div>
    }
  }
  res_body(res_body_type,res_body){
    if(res_body_type === 'json'){
      return <div className="colBody">
        <span className="colKey">返回Body：</span>
        <div id="vres_body_json" style={{ minHeight: "300px" }}></div>
      </div>
    }else if(res_body_type === 'raw'){
      return <div className="colBody">
        <span className="colKey">返回Body：</span>
        <div>{res_body}</div>
      </div>
    }
  }

  req_query(query){
    const columns = [{
      title: '参数名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '参数值',
      dataIndex: 'value',
      key: 'value'
    }, {
      title: '备注',
      dataIndex: 'required',
      key: 'required',
      width: '45%'
    }];

    const dataSource = [];
    if(query&&query.length){
      query.map((item,i)=>{
        dataSource.push({
          key: i,
          name: item.name,
          value: item.desc,
          required: item.required?"必须":"非必须"
        })
      })
    }

    return  <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />;
  }
  

  bindAceEditor(){
    if(!this.state.init&&(this.props.curData.req_body_type === "json"&&this.props.curData.title)){
      mockEditor({
        container: 'vreq_body_json',
        data: this.props.curData.req_body_other,
        readOnly:true,
        onChange: function () {}
      })
    }
    if(!this.state.init&&(this.props.curData.res_body_type === "json"&&this.props.curData.title)){
      mockEditor({
        container: 'vres_body_json',
        data: this.props.curData.res_body,
        readOnly:true,
        onChange: function () {}
      })
    }
  }
  componentDidMount(){
    if(!this.state.init){
      this.bindAceEditor.bind(this)();
    }
  }
  componentDidUpdate(){
    this.bindAceEditor.bind(this)();
  }
  componentWillUpdate(){
    if(!this.props.curData.title&&this.state.init){
      this.setState({init: false});
    }
  }
  render () {
    const dataSource = [];
    console.log(this.props.curData)
    if(this.props.curData.req_headers&&this.props.curData.req_headers.length){
      this.props.curData.req_headers.map((item,i)=>{
        dataSource.push({
          key: i,
          name: item.name,
          required: item.required?"必须":"非必须",
          value: item.value
        })
      })
    }
    
    const columns = [{
      title: '参数名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '参数值',
      dataIndex: 'value',
      key: 'value'
    }, {
      title: '备注',
      dataIndex: 'required',
      key: 'required',
      width: '45%'
    }];
    let status = {
      undone: "未完成",
      done: "完成"
    }
    let res = <div className="caseContainer">
      <div className="colName">
        <span className="colKey">接口名：</span>
        <span className="colValue">{this.props.curData.title}</span>
      </div>
      <div className="colMethod">
        <span className="colKey">请求方法：</span>
        <span className="colValue">{this.props.curData.method}</span>
      </div>
      <div className="colPath">
        <span className="colKey">接口路径：</span>
        <span className="colValue">{this.props.curData.path}</span>
      </div>
      <div className="colstatus">
        <span className="colKey">状态：</span>
        <span className="colValue">{status[this.props.curData.status]}</span>
      </div>
      <div className="colAddTime">
        <span className="colKey">创建时间：</span>
        <span className="colValue">{formatTime(this.props.curData.add_time)}</span>
      </div>
      <div className="colUpTime">
        <span className="colKey">更新时间：</span>
        <span className="colValue">{formatTime(this.props.curData.up_time)}</span>
      </div>
      <div className="colDesc">
        <span className="colKey">接口描述：</span>
        <span className="colValue">{this.props.curData.desc}</span>
      </div>
      <div className="colHeader">
        <span className="colKey">请求Headers：</span>
        <Table bordered size="small" pagination = {false} columns= {columns} dataSource = {dataSource} />
      </div>
      <div className="colQuery">
        <span className="colKey">Query：</span>
        {this.req_query(this.props.curData.req_query)}
      </div>
      <div className="colreqBodyType">
        <span className="colKey">请求Body类型：</span>
        <span className="colValue">{this.props.curData.req_body_type}</span>
      </div>
      {this.req_body_form(this.props.curData.req_body_type,this.props.curData.req_body_form)}
      <div className="colreqBodyType">
        <span className="colKey">返回Body类型：</span>
        <span className="colValue">{this.props.curData.res_body_type}</span>
      </div>
      {this.res_body(this.props.curData.res_body_type,this.props.curData.res_body)}
    </div>;
    if(!this.props.curData.title){
      if(this.state.init){
        res = <div></div>;
      }else{
        res = <ErrMsg type="noData" />;
      }
    }
    return res;
  }
}


export default View