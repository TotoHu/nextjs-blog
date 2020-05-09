import Head from 'next/head'
import {getBrunchState} from '../lib/works'
var React = require("react");
var ReactDOM = require("react-dom");
//import {updateBrunchState, getBrunchState} from '../lib/works'

export async function getStaticProps() {
  // const brunches = [
  //   {id: 1, name: 'Homepages'},
  //   {id: 2,name: 'MARKETING'},
  //   {id: 3,name: 'NewTradeShowCenterTemp'},
  //   {id: 4,name: 'SEO-Temp2'},
  //   {id: 5,name: 'NEWS'},
  //   {id: 6,name: 'HELP'},
  //   {id: 7,name: 'SYP'},
  //   {id: 8,name: 'tscgi-bin'},
  // ]

  // const members = [
  //   {id: 1,name: 'Tracy'},
  //   {id: 2,name: 'Toto'},
  //   {id: 3,name: 'Fox'},
  //   {id: 4,name: 'Gavin'},
  // ]
  const data = getBrunchState();
  //console.log(typeof data, data);
  return {
    props: 
      {
      // brunches,
      // members,
      data
    }// will be passed to the page component as props
  }
}


class BrunchForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: [],
    }
    this.updateList = this.updateList.bind(this);
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

  getList(){
    let data = this.props.list;
    //let data = getBrunchState();
    //let data = [{"id": 1, "brunchid": 1, "memberids": ",1,2"},{"id": 2, "brunchid": 2, "memberids": ",2,3"}];
    this.setState({
      list: data
    })
  }

  updateList(e, brunchid, memberid){
    let result = this.state.list.slice();
    if(e.target.innerText == this.STATUS.OFF){
      let isChecked = false;
      for(let i in result){
        if(result[i].brunchid == brunchid){
          if(result[i].memberids.indexOf(','+memberid+',') == -1){
            result[i].memberids += ','+memberid;
            isChecked = true;
          }
        }
      }
      if(!isChecked){
        result.push({
          "id": result.length,
          "brunchid": brunchid, 
          "memberids": ','+memberid
        })
      }
    }else{
      for(let i in result){
        if(result[i].brunchid == brunchid){
          result[i].memberids = (result[i].memberids+',').replace(','+memberid+',', ',');
          result[i].memberids = result[i].memberids.slice(0, result[i].memberids.length-1);
          break;
        }
      }
    }
    this.setState({list: result});
    //updateBrunchState(result);
  }

  componentDidMount(){
		// conn.then(value=>{alert("success")})
		this.getList();
	}

  render(){
    const brunches = [
      {id: 1, name: 'Homepages'},
      {id: 2,name: 'MARKETING'},
      {id: 3,name: 'NewTradeShowCenterTemp'},
      {id: 4,name: 'SEO-Temp2'},
      {id: 5,name: 'NEWS'},
      {id: 6,name: 'HELP'},
      {id: 7,name: 'SYP'},
      {id: 8,name: 'tscgi-bin'},
    ];
  
    const members = [
      {id: 1,name: 'Tracy'},
      {id: 2,name: 'Toto'},
      {id: 3,name: 'Fox'},
      {id: 4,name: 'Gavin'},
    ];

    return(
      <ul className="list">
        <li className="item">
          <span className="label"></span>
          {members.map( ({id, name}) => (
            <span key={'user'+id}>{name}</span>
          ))}
        </li>
        { brunches.map( (brunch) => (
          <li className="item" key={brunch.id}>
            <span className="label">{brunch.name}</span>
            {members.map( (member) => (
              
              <span key={member.id}>
                <span className="toggle" onClick={(e)=>this.updateList(e,brunch.id, member.id)}>
                  {this.checkSelected(brunch.id, member.id)? 
                    this.STATUS.ON :
                    this.STATUS.OFF}
                </span>
                
              </span>
              ))}
          </li>
          ))
        }
      </ul>
    )
  }

}



export default function Work({data}) {//, data

  return (
    <>
      <link rel="stylesheet" href="/style.css" />
      <BrunchForm list={data} />
    </>
  )
}


/* export default function Work({brunches, members, data}) {//, data

  const STATUS = {
    ON: 'ON',
    OFF: 'OFF'
  };

  let result = data;

  function checkSelected(brunchid, memberid){
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

  function handleClick(e,brunchid, memberid){
    if(e.target.innerText == STATUS.OFF){
      let isChecked = false;
      for(let i in result){
        if(result[i].brunchid == brunchid){
          if(result[i].memberids.indexOf(','+memberid+',') == -1){
            result[i].memberids += ','+memberid;
            isChecked = true;
          }
        }
      }
      if(!isChecked){
        result[result.length].brunchid = brunchid;
        result[result.length].memberids = ','+memberid;
      }
      e.target.innerText = STATUS.ON;
    }else{
      for(let i in result){
        if(result[i].brunchid == brunchid){
          result[i].memberids = (result[i].memberids+',').replace(','+memberid+',', ',');
          result[i].memberids = result[i].memberids.slice(0, result[i].memberids.length-1);
          break;
        }
      }
      e.target.innerText = STATUS.OFF;
    }
    
    updateBrunchState(result);
  }


  //this.handleClick = this.handleClick.bind(this);
  return (
    <>
      <Head>
        <title>TeamSite Deploy</title>
      </Head>
      <link rel="stylesheet" href="/style.css" />
      <script src="jquery"></script>
      <div>
        <ul className="list">
          <li className="item">
            <span className="label"></span>
            {members.map( ({id, name}) => (
              <span key={'user'+id}>{name}</span>
            ))}
          </li>
          { brunches.map( (brunch) => (
            <li className="item" key={brunch.id}>
              <span className="label">{brunch.name}</span>
              {members.map( (member) => (
                
                <span key={member.id}>
                  <span className="toggle" onClick={(e)=>handleClick(e,brunch.id, member.id)}>
                    {checkSelected(brunch.id, member.id)? 
                      STATUS.ON :
                      STATUS.OFF}
                  </span>
                  
                </span>
                ))}
            </li>
            ))
          }
        </ul>
        
      </div>
      

    </>
  )
}
 */