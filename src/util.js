import Setting from './util/setting';
const setting = new Setting();

let _city = '';
/**
 * JSON 转 queryString
 * @param  {JSON} params [description]
 * @return {[type]}        [description]
 */
export function queryString( params ){
	if( params ){
		return Object.keys( params ).map( function( key ){
			return [ encodeURIComponent(key), encodeURIComponent( params[key] ) ].join('=');
		}).join('&');
	}else{
		return '';
	}
}
// 去抖动
export const debounce = ( fn, delay = 200) =>{
	let timer = null;
	return (...args)=>{
		clearTimeout( timer );
		timer = setTimeout(()=>{
			fn.apply(null, args);
		}, delay);
	}
}

function qs( json ){
	return Object.keys(json).map(function( key ){
		return key + '=' + encodeURIComponent( json[key] );
	}).join('&');
}

let noop = function(){}

const _request = (option, type) => {
	let url = option.url;
	let dataType = (option.dataType || '').toLowerCase();
	let data = option.data;
	let success = option.success || noop;
	let error = option.error || noop;

	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function (data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				let ret = xhr.responseText;
				if( dataType === 'json'){
					try{
						ret = JSON.parse(ret);
					}
					catch( err ){
						error( err );
					}
				}
				else if (dataType === 'xml' ){
					ret = xhr.responseXML;
				}
				success( ret );
			} else {
        error();
      }
		}
	};

	let queryString = qs(data);
	if( type === 'GET' ){
		url += '?' + queryString;
	}
  xhr.open(type, url, true);
  if(type === 'POST') {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  // 添加http
  }
	xhr.send(type === 'GET' ? null : queryString);
}

export const get = (option) =>{
  _request(option, 'GET');
};
export const post = (option) =>{
  _request(option, 'POST');
};

//获取当前所在城市
export const getCurrentCity = () =>{
  //新浪接口-获取当前城市
  get({
    url: 'http://int.dpool.sina.com.cn/iplookup/iplookup.php',
    dataType: 'json',
    data:{
      format: 'json',
    },
    success(ret) {
      let city = ret.city;
      //获取所在城市的天气情况
      weatherQuery(city);
    },
    error(error) {
      weatherQuery('北京');
    }
  });
}

//天气查询
export const weatherQuery = (city) =>{
  _city = city;
  post({
    url: 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName',
    dataType: 'xml',
    data:{
      theCityName: city,
    },
    success(ret) {
      if (ret != null) {
        translateXML(ret);
      }
    },
    error(err) {
      setting.get().then( data =>{
        renderResult(data);
      });
    }
  });
}

function getIcon(weather){
  let desc = weather && weather.split('转')[0].trim();
  let weatherPic;
  if(desc){
    switch(desc){
      case '扬沙':
        weatherPic = 'yangsha';
      case '浮尘':
        weatherPic = 'fuchen';
      case '阴':
        weatherPic = 'yin';
        break;
      case '多云':
        weatherPic = 'duoyun';
        break;
      case '晴':
        weatherPic = 'sun';
        break;
      case '小雨':
        weatherPic = 'xiaoyu';
        break;
      case '小到中雨':
        weatherPic = 'xiaoyu';
        break;
      case '中雨':
        weatherPic = 'zhongyu';
        break;
      case '中到大雨':
        weatherPic = 'zhongyu';
        break;
      case '大雨':
        weatherPic = 'dayu';
        break;
      case '暴雨':
      case '大到暴雨':
        weatherPic = 'baoyu';
        break;
      case '阵雨':
        weatherPic = 'zhenyu';
        break;
      case '雷阵雨':
        weatherPic = 'leizhenyu';
        break;
      case '雨夹雪':
        weatherPic = 'yujiaxue';
        break;
      case '小雪':
        weatherPic = 'xiaoxue';
        break;
      case '中雪':
        weatherPic = 'zhongxue';
        break;
      case '大雪':
        weatherPic = 'daxue';
        break;
      case '暴雪':
      case '大到暴雪':
        weatherPic = 'baoxue';
        break;
      default:
    }
  }
  return weatherPic;
}

//插入结果html
function renderResult(cont) {
  let rootDom = document.getElementById('result');
  let weather = cont[6] && cont[6].split(' ')[1];
  //设置tooltip
  chrome.browserAction.setTitle({ title: weather });

  // 实时天气
  let weatherPic = getIcon(weather);
  //将action图标设置成今天对应的天气
  chrome.browserAction.setIcon({ path: 'image/' + weatherPic + '.svg'});

  let realInfo = cont[10] || '';
  let temperature = realInfo.match('\\d+(\?\=℃)');
  let wind = realInfo.match(/风力：([\u4e00-\u9fa5\w\s]+)(?=[；。])/)[1];
  let humidity = realInfo.match(/湿度：(\d+)(?=%)/)[1];
  let ultraviolet = realInfo.match(/紫外线强度：([\u4e00-\u9fa5\w\s]+)(?=[；。])/)[1];
  let airQuality = realInfo.match(/空气质量：([\u4e00-\u9fa5\w\s]+)(?=[；。])/)[1];
  // 最近几天天气
  let latest = [
    {
      time: '今天',
      icon: weatherPic,
      temper: cont[5].replace('/','~'),
      dec: weather,
      wind: cont[7],
    },{
      time: '明天',
      icon: getIcon(cont[13].split(' ')[1]),
      temper: cont[12].replace('/','~'),
      dec: cont[13].split(' ')[1],
      wind: cont[14],
    },{
      time: '后天',
      icon: getIcon(cont[18].split(' ')[1]),
      temper: cont[12].replace('/','~'),
      dec: cont[18].split(' ')[1],
      wind: cont[19],
    }
  ]
  let tpl = `<div class="normal">天气实况 | ${cont[1]}-${cont[0]}</div>
    <div class="header flex space-between">
      <div class="left">
        <div class="flex">
          <img src="image/${weatherPic}.svg"/>
          <span>
            <span class="middle">${temperature}</span>
            <span class="top">°C</span>
          </span>
        </div>
        <div class='desc'>${weather}</div>
      </div>
      <div class="flex">
        <div class="item">
          <div class="title">风力</div>
          <div class="value">${wind.split(' ')[1]}</div>
        </div>
        <div class="item">
          <div class="title">湿度</div>
          <div class="value">${humidity}</div>
        </div>
        <div class="item">
          <div class="title">紫外线</div>
          <div class="value">${ultraviolet}</div>
        </div>
        <div class="item">
          <div class="title">空气质量</div>
          <div class="value"><span class="bg-color">${airQuality}</span></div>
        </div>
      </div>
  </div>`;

  let latestTpl = `<div class="body">${
    latest.map((item, index) => {
      return `<div class="item-container">
        <div>${item.time}</div>
        <img src="image/${item.icon}.svg"/>
        <div>${item.temper}</div>
        <div>${item.dec}</div>
        <div>${item.wind.split('转')[0]}</div>
      </div>`
    }).join("\n")
  }</div>`;

  let lifeIndex = cont[11].split('。').slice(2);
  let lifeTpl = `<div class="details">${
    lifeIndex.map((item, index) => {
      return `<div>${item}</div>`
    }).join("\n")
  }</div>`;


  rootDom.innerHTML = tpl + '\n' + latestTpl + lifeTpl;
}
//布局结果页
function translateXML(xmlnode) {
  let root = xmlnode.getElementsByTagName("ArrayOfString")[0];
  let strings = xmlnode.getElementsByTagName("string");
  //类数组对象转换为数组
  let arr = Array.prototype.slice.call(strings);
  let contents = arr.map((item) => {
    return item.innerHTML ;
  });
  if ((contents[0] == "查询结果为空！") || (!contents[1])) {
    if (contents[0] == "查询结果为空！"){
      document.getElementById("error").innerHTML = '请出入正确的城市名称';
    } else {
      document.getElementById("error").innerHTML = contents[0];
    }
    //渲染上次请求结果
    setting.get().then( data =>{
      renderResult(data);
    });
  } else {
    document.getElementById("error").innerHTML = '';
    //将contents存入chrome.storage
    setting.set(contents);// 存入localstorage
    renderResult(contents);

    //将查询记录存入localStorage
    saveSearchCitys();
  }
}
function saveSearchCitys() {
  let cache = localStorage.getItem('citys');
  if(cache) {
    if(cache.indexOf(_city) > -1){
      return;
    }
    cache = [_city, cache].join();
  } else {
    cache = _city;
  }
  localStorage.setItem('citys', cache);
}
export const getSearchCitys = () => {
  let citys = localStorage.getItem('citys').split(',');
  let suggestion = document.getElementById('suggestion');
  suggestion.innerHTML = `<ul class="list-container">${
    citys.map((item, index) =>{
      return `<li class="list-item">${item}</li>`
    }).join("\n")
  }</ul>`;
}
export const getCity = (item) => {
  // let city = event.currentTarget.innerText;
  document.getElementById('city').value = item;
}

