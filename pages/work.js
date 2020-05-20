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

const PORT = 3000;

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
      enterstr: ''
    }
    this.send = this.send.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) { this.setState({enterstr: event.target.value});  }

  componentDidMount(){}

  send(){
    let content = this.state.enterstr;
    axios.get('/api/email', {
      params:{
        action: 'send',
        content: content,
      },
      proxy: {
        port: PORT,
      }
    }).then(function(res){
      console.log('success############');
    }).catch(function(err){
      console.log('fail############');
      console.log(err);
    });
  }

  render(){
    return(
      <>
        <div><textarea value={this.state.enterstr} onChange={this.handleChange} /></div>
        <button className="email_btn" onClick={(e)=>this.send(e)}>Send a email</button>
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
