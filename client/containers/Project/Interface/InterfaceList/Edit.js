import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import InterfaceEditForm from './InterfaceEditForm.js'
import { updateInterfaceData,fetchInterfaceList } from '../../../../reducer/modules/interface.js';
import axios from 'axios'
import { message } from 'antd'
import './Edit.scss'
import { withRouter, Link } from 'react-router-dom';

@connect(
  state => {
    return {
      curdata: state.inter.curdata,
      currProject: state.project.currProject
    }
  }, {
    updateInterfaceData,
    fetchInterfaceList
  }
)

class InterfaceEdit extends Component {
  static propTypes = {
    curdata: PropTypes.object,
    currProject: PropTypes.object,
    updateInterfaceData: PropTypes.func,
    fetchInterfaceList: PropTypes.func,
    match: PropTypes.object,
    switchToView: PropTypes.func
  }

  constructor(props) {
    super(props)
    const { curdata, currProject } = this.props;
    this.state = {
      mockUrl: location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "") + `/mock/${currProject._id}${currProject.basepath}${curdata.path}`,
      curdata: {},
      status: 0
    }
  }

  onSubmit = async (params) => {
    params.id = this.props.match.params.actionId;
    let result = await axios.post('/api/interface/up', params);
    this.props.fetchInterfaceList(this.props.currProject._id).then();
    if (result.data.errcode === 0) {
      this.props.updateInterfaceData(params);
      message.success('保存成功');
      this.props.switchToView()
    } else {
      message.error(result.data.errmsg)
    }
  }

  componentWillUnmount() {
    try {
      if (this.state.status === 1) {
        this.WebSocket.close()
      }
    } catch (e) {
      return null
    }
  }

  componentWillMount() {
    let domain = location.hostname + (location.port !== "" ? ":" + location.port : "");
    this.setState({
      curdata: this.props.curdata,
      status: 1
    })

    let s = new WebSocket('ws://' + domain + '/api/interface/solve_conflict?id=' + this.props.match.params.actionId);
    s.onopen = () => {
      this.WebSocket = s;
    }

    s.onmessage = (e) => {
      let result = JSON.parse(e.data);
      if (result.errno === 0) {
        this.setState({
          curdata: result.data,
          status: 1
        })
      } else {
        this.setState({
          curdata: result.data,
          status: 2
        })
      }

    }

    s.onerror = () => {
      console.error('websocket connect failed.')
    }



  }

  render() {
    return <div className="interface-edit">
      {this.state.status === 1 ?
        <InterfaceEditForm cat={this.props.currProject.cat} mockUrl={this.state.mockUrl} basepath={this.props.currProject.basepath} onSubmit={this.onSubmit} curdata={this.state.curdata} />
        :
        null}
      {
        this.state.status === 2 ?
          <div style={{ textAlign: 'center', fontSize: '14px', paddingTop: '10px' }}>
            <Link to={'/user/profile/' + this.state.curdata.uid}><b>{this.state.curdata.username}</b></Link>
            <span>正在编辑该接口，请稍后再试...</span>
          </div>
          :
          null}

    </div>
  }
}

export default withRouter(InterfaceEdit);
