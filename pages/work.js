var React = require("react");
import axios from 'axios'

/* export async function getStaticProps() {
  const response = await axios.get('/api/workapi', {
    proxy: {
      port: 3000,
    }
  });
  const data = response.data.data; //getBrunchState();
  return {
    props: 
      {
        data
      }// will be passed to the page component as props
  }
} */

const PORT = 80;

class BrunchForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: [],
      isLoading: false
    }
    this.updateList = this.updateList.bind(this);
    this.getList = this.getList.bind(this);
  }

  STATUS = {
    ON: 'ON',
    OFF: 'OFF'
  };

  checkSelected(brunchid, memberid){
    let result = this.state.list;
    let isChecked = false;
    for(let item of result){
      if(item.brunchid == brunchid){
        if((item.memberids+',').indexOf(','+memberid+',') != -1){
          isChecked = true;
        }
      }
    }
    return isChecked;
  }

  async getList(){
    const response = await axios.get('/api/workapi', {
      proxy: {
        port: PORT,
      }
    });
    const data = response.data.data;
    this.brunches = data.brunches;
    this.members = data.members;
    this.setState({list: data.result, isLoading: true});
  }

  updateList(e, brunchid, memberid){
    let status = e.currentTarget.getAttribute("data-status")== this.STATUS.OFF? this.STATUS.ON : this.STATUS.OFF;
    let self = this;
    axios.get('/api/workapi', {
      params:{
        brunchid,
        memberid,
        status
      },
      proxy: {
        port: PORT,
      }
    }).then(function(res){
      self.setState({list: res.data.data.result});
    }).catch(function(err){
      console.log(err);
    });
  }

  componentDidMount(){
		this.getList();
	}

  render(){
    return(
      <>
        {this.state.isLoading?
        <ul className="list">
          <li className="tit">Deploy Usage Table</li>
          <li className="item">
            <span className="label"></span>
            {this.members.map( ({id, name}) => (
              <span key={'user'+id}>{name}</span>
            ))}
          </li>
          { this.brunches.map( (brunch) => (
            <li className="item" key={brunch.id}>
              <span className="label">{brunch.name}</span>
              {this.members.map( (member) => (
                <span key={member.id}>
                    {this.checkSelected(brunch.id, member.id)? 
                      <span className="switch on" data-status="ON" onClick={(e)=>this.updateList(e,brunch.id, member.id)}><div className="slider round"></div></span> :
                      <span className="switch" data-status="OFF" onClick={(e)=>this.updateList(e,brunch.id, member.id)}><div className="slider round"></div></span>}
                </span>
                ))}
            </li>
            ))
          }
        </ul>
        :
        ''
      }
      </>
      
    )
  }

}



class EmailForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      enterstr: '',
      pwd:'',
      result: '',
      addr:'',
    }
    this.send = this.send.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, idstr) { 
    this.setState({ [idstr]: event.target.value});  
  }

  componentDidMount(){}

  send(){
    let self = this;
    self.setState({ result: 'Processing...' })
    let content = this.state.enterstr;
    let pwd = this.state.pwd;
    let addr = this.state.addr;
    axios.post('/api/email', {
      params:{
        action: 'send',
        content,
        pwd,
        addr
      },
      proxy: {
        port: PORT,
      }
    }).then(function(res){
      if(res.data.result == 'Y'){
        self.setState({ result: 'Done!' })
      }
      console.log(res.data.result);
    }).catch(function(err){
      console.log('fail############');
      console.log(err);
    });
  }

  render(){
    return(
      <>
        <p className="email_head">Send Email</p>
        <p className="email_tit">* Paste your code to below and simply click "Send"</p>
        <div><textarea className="email_txt" value={this.state.enterstr} placeholder="paste your html here" onChange={(e)=>this.handleChange(e, 'enterstr')} /></div>
        <p className="email_tit">Test email addresses (eg: test1@test.com, test2@test.com)</p>
        <div><input className="email_receiver" type="text" placeholder="test1@test.com, test2@test.com" value={this.state.addr} onChange={(e)=>this.handleChange(e, 'addr')} /></div>
        <p className="email_tit">* Enter your security code and send</p>
        <div><input className="email_pwd" type="password" placeholder="Security Code" value={this.state.pwd} onChange={(e)=>this.handleChange(e, 'pwd')} /><button className="email_btn" onClick={(e)=>this.send(e)}>Send a email</button><span className="email_result">{this.state.result}</span></div>
        
      </>
      
    )
  }

}

export default function Work() {//, data

  return (
    <>
      <link rel="stylesheet" href="/style.css" />
      <EmailForm />
      <div className="email_space"></div>
      
      <BrunchForm />
    </>
  )
}
