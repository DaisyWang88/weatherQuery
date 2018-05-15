
import {
  get,
  post,
  getCurrentCity,
  weatherQuery,
  getSearchCitys,
  getCity,
} from './util';

window.onload = () => {
  //获取当前所在城市，并查询该城市天气情况
  getCurrentCity();

  //按Entry键执行查询
	document.getElementById("city").onkeydown = () =>{
		if (event.keyCode == 13) {
      document.getElementById('suggestion').innerHTML = '';
			weatherQuery(document.querySelector("#city").value.trim());
		}
  };
  // 点击'城市天气查询按钮'
	document.getElementById("querybutton").onclick = (event) => {
		weatherQuery(document.querySelector("#city").value.trim() || '北京');
  };
  //input获取焦点
  document.getElementById("city").onclick = () =>{
    getSearchCitys();
  };
  //suggestion点选事件
  document.getElementById("suggestion").addEventListener('click', (event) => {
    let city = event.target.innerText;
    getCity(city);
    weatherQuery(document.querySelector("#city").value.trim());
  });
  //suggestion隐藏
  document.body.addEventListener('click', (event) => {
    let target = event.target;
    let id = target.id;
    if(id !== 'suggestion' && id !== 'city') {
      setTimeout(() =>{
        document.getElementById('suggestion').innerHTML = '';
      }, 100);
    }
  });
};