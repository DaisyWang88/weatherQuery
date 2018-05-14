
import {
  get,
  post,
  getCurrentCity,
  weatherQuery,
} from './util';

// let setting = new Setting();
// let _word;
// let city;

//布局结果页
// function translateXML(xmlnode) {
//   let root = xmlnode.getElementsByTagName("ArrayOfString")[0];
//   let strings = xmlnode.getElementsByTagName("string");
//   //类数组对象转换为数组
//   let arr = Array.prototype.slice.call(strings);
//   let contents = arr.map((item) => {
//     return item.innerHTML ;
//   });
//   if (contents[1]){
//     //将contents存入localstorage
//     setting.set(contents);// 存入localstorage
//     renderResult(contents);
//   } else {
//     //渲染上次请求结果
//     setting.get().then( data =>{
//       renderResult(data);
//     });
//   }


// }
// function getIcon(weather){
//   let desc = weather && weather.split('转')[0].trim();
//   let weatherPic;
//   if(desc){
//     switch(desc){
//       case '扬沙':
//         weatherPic = 'yangsha';
//       case '浮尘':
//         weatherPic = 'fuchen';
//       case '阴':
//         weatherPic = 'yin';
//         break;
//       case '多云':
//         weatherPic = 'duoyun';
//         break;
//       case '晴':
//         weatherPic = 'sun';
//         break;
//       case '小雨':
//         weatherPic = 'xiaoyu';
//         break;
//       case '中雨':
//         weatherPic = 'zhongyu';
//         break;
//       case '大雨':
//         weatherPic = 'dayu';
//         break;
//       case '暴雨':
//       case '大到暴雨':
//         weatherPic = 'baoyu';
//         break;
//       case '阵雨':
//         weatherPic = 'zhenyu';
//         break;
//       case '雷阵雨':
//         weatherPic = 'leizhenyu';
//         break;
//       case '雨夹雪':
//         weatherPic = 'yujiaxue';
//         break;
//       case '小雪':
//         weatherPic = 'xiaoxue';
//         break;
//       case '中雪':
//         weatherPic = 'zhongxue';
//         break;
//       case '大雪':
//         weatherPic = 'daxue';
//         break;
//       case '暴雪':
//       case '大到暴雪':
//         weatherPic = 'baoxue';
//         break;
//       default:
//     }
//   }
//   return weatherPic;
// }
// //插入结果html
// function renderResult(cont) {
//   let rootDom = document.getElementById('result');
//   let weather = cont[6] && cont[6].split(' ')[1];
//   //设置tooltip
//   chrome.browserAction.setTitle({ title: weather });

//   // 实时天气
//   let weatherPic = getIcon(weather);
//   //将action图标设置成今天对应的天气
//   chrome.browserAction.setIcon({ path: 'image/' + weatherPic + '.svg'});

//   let realInfo = cont[10] || '';
//   let temperature = realInfo.match('\\d+(\?\=℃)');
//   let wind = realInfo.match(/风力：([\u4e00-\u9fa5\w\s]+)(?=[；。])/)[1];
//   let humidity = realInfo.match(/湿度：(\d+)(?=%)/)[1];
//   let ultraviolet = realInfo.match(/紫外线强度：([\u4e00-\u9fa5\w\s]+)(?=[；。])/)[1];
//   let airQuality = realInfo.match(/空气质量：([\u4e00-\u9fa5\w\s]+)(?=[；。])/)[1];
//   // 最近几天天气
//   let latest = [
//     {
//       time: '今天',
//       icon: weatherPic,
//       temper: cont[5].replace('/','~'),
//       dec: weather,
//       wind: cont[7],
//     },{
//       time: '明天',
//       icon: getIcon(cont[13].split(' ')[1]),
//       temper: cont[12].replace('/','~'),
//       dec: cont[13].split(' ')[1],
//       wind: cont[14],
//     },{
//       time: '后天',
//       icon: getIcon(cont[18].split(' ')[1]),
//       temper: cont[12].replace('/','~'),
//       dec: cont[18].split(' ')[1],
//       wind: cont[19],
//     }
//   ]
//   let tpl = `<div class="normal">天气实况 | ${cont[1]}-${cont[0]}</div>
//     <div class="header flex space-between">
//       <div class="left">
//         <div class="flex">
//           <img src="image/${weatherPic}.svg"/>
//           <span>
//             <span class="middle">${temperature}</span>
//             <span class="top">°C</span>
//           </span>
//         </div>
//         <div class='desc'>${weather}</div>
//       </div>
//       <div class="flex">
//         <div class="item">
//           <div class="title">风力</div>
//           <div class="value">${wind.split(' ')[1]}</div>
//         </div>
//         <div class="item">
//           <div class="title">湿度</div>
//           <div class="value">${humidity}</div>
//         </div>
//         <div class="item">
//           <div class="title">紫外线</div>
//           <div class="value">${ultraviolet}</div>
//         </div>
//         <div class="item">
//           <div class="title">空气质量</div>
//           <div class="value"><span class="bg-color">${airQuality}</span></div>
//         </div>
//       </div>
//   </div>`;

//   let latestTpl = `<div class="body">${
//     latest.map((item, index) => {
//       return `<div class="item-container">
//         <div>${item.time}</div>
//         <img src="image/${item.icon}.svg"/>
//         <div>${item.temper}</div>
//         <div>${item.dec}</div>
//         <div>${item.wind.split('转')[0]}</div>
//       </div>`
//     }).join("\n")
//   }</div>`;

//   let lifeIndex = cont[11].split('。').slice(2);
//   let lifeTpl = `<div class="details">${
//     lifeIndex.map((item, index) => {
//       return `<div>${item}</div>`
//     }).join("\n")
//   }</div>`;


//   rootDom.innerHTML = tpl + '\n' + latestTpl + lifeTpl;
// }


// //天气查询
// const weatherQuery = (word, callback) =>{
//   _word = word.trim();
//   post({
//     url: 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getWeatherbyCityName',
//     dataType: 'xml',
//     data:{
//       theCityName: _word || city,
//     },
//     success(ret) {
//       if (ret != null) {
//         callback(ret);
//       }
//     },
//     error(err) {
//       setting.get().then( data =>{
//         renderResult(data);
//       });
//     }
//   });
// }

/*
 * 导出单词查询历史
 */
// let exportHistory = () => {
// 	let cachedWords = localStorage.getItem('wordcache');
// 	if (cachedWords) {
// 		let extDetail = chrome.app.getDetails();
// 		let extName = extDetail.name;
// 		let version = extDetail.version;
// 		let BR = '\r\n';
// 		let banner = [
// 			`【${extName}】V${version} 查询历史备份文件`,
// 			`${new Date().toString().slice(0, 24)}`,
// 			`By https://chrome.google.com/webstore/detail/chgkpfgnhlojjpjchjcbpbgmdnmfmmil`,
// 			`${new Array(25).join('=')}`
// 		].join(BR).trim();
// 		let content = `${banner}${BR}${cachedWords.replace(/\,/g, BR)}`;
// 		saveContent2File(content, `youDaoCrx-history ${+new Date()}.txt`);
// 	}
// }
// /*
//  * 保存为系统文件
//  */
// function saveContent2File(content, filename) {
// 	let blob = new Blob( [content], {
// 		type: "text/plain;charset=utf-8"
// 	});
// 	saveAs(blob, filename);
// }

// function saveOptions() {
// 		let elem = document.getElementById(key);
// 		} else {
// 		}
// 	}
// 	// https://developer.chrome.com/extensions/storage
// }


window.onload = () => {
  //获取当前所在城市，并查询该城市天气情况
  getCurrentCity();

  //按Entry键执行查询
	document.getElementById("city").onkeydown = () =>{
		if (event.keyCode == 13) {
			weatherQuery(document.querySelector("#city").value.trim());
		}
  };
  // 点击'城市天气查询按钮'
	document.getElementById("querybutton").onclick = (event) => {
		weatherQuery(document.querySelector("#city").value.trim() || '北京');
  };
  //点击suggestion
	// document.getElementsByClass("list-item").onclick = (event) => {
	// 	weatherQuery(document.querySelector("#city").value.trim() || '北京');
  // };
};