function getCookie(name){
	/* получение значения куки по её имени*/
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

//таймер для периодического опрашивания
var timer;

//диагональные ячейки
var unaccept_cell = {1:[6], 2:[5,7], 3:[6,8], 4:[7], 5:[2,10], 6:[1,3,9,11], 7:[2,4,10,12], 8:[3,11], 9:[6, 14], 10:[5,7,13,15], 11:[6,8,14,16], 12:[7,15], 13:[10], 14:[9,11], 15:[10,12], 16:[11]};

//все окружающие ячейки
var around_cell = {1:[2,5,6], 2:[1,3,5,6,7], 3:[2,4,6,7,8], 4:[3,7,8], 5:[1,2,6,9,10], 6:[1,2,3,5,7,9,10,11], 7:[2,3,4,6,8,10,11,12], 8:[3,4,7,11,12], 9:[5,6,10,13,14], 10:[5,6,7,9,11,13,14,15], 11:[6,7,8,10,12,14,15,16], 12:[7,8,11,15,16], 13:[9,10,14], 14:[9,10,11,13,15], 15:[10,11,12,14,16], 16:[11,12,15]};


var enemy_big_ship = [];
var enemy_small_ship;

//отправляем сообщение о начале игры и фиксации занятых позиций
function fix_my_position(){

	var wrap = document.getElementById('wrap_left');
	wrap.style.display = 'block';
	var button = document.getElementById('fix_position');
	button.innerHTML = 'Позиции заняты';

	var big = ready_answer[1][0].toString() +',' + ready_answer[1][1].toString();
	var small = ready_answer[2].toString();
	//отправляем данные о расположении кораблей
	data = "big_ship=" + encodeURIComponent(big) + "&small_ship=" + encodeURIComponent(small);

	// ajax-запрос
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("POST", "/start_game", true);

	var csrf = getCookie('csrftoken');
	 

    httpRequest.setRequestHeader("X-CSRFToken", csrf);
 
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
 
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState == 4 && httpRequest.status == 200){
			var answer = httpRequest.responseText;

				//запускаем функцию для обновления данных
				timer = setInterval(wait_enemy, 2000);

				var message_text = document.getElementById('message_text');
				message_text.innerHTML = answer;
			
		}
	}
	httpRequest.send(data);

}

//функция проверяет наличие соперника, текущий ход, активность игры, выполняет обновление данных с интервалом в 2с
function wait_enemy(){

	// ajax-запрос
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("POST", "/wait_enemy", true);

	 var csrf = getCookie('csrftoken');

    httpRequest.setRequestHeader("X-CSRFToken", csrf);
 
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
 
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState == 4 && httpRequest.status == 200){
			var answer;
			//проверяем пришел ли ответ в json-форме или в виде строки
			try{
				answer = JSON.parse(httpRequest.responseText);
				var message_text = document.getElementById('message_text');
				var wrap_right = document.getElementById('wrap_right');
				var step = document.getElementById('step');

				if(answer["shoots"]){
						//показываем выстрелы соперника на собственном поле
						var all_enemy_shoots = answer["shoots"].split(',')
					
					for (var item in all_enemy_shoots){

						var id_name = 'my_field_'+ all_enemy_shoots[item];
						
						var my_cell = document.getElementById(id_name);
						
						my_cell.style.cssText = "background: grey;\
						opacity: 0.8;\
						border: 1px solid white;";
					
						}
					}

				if(answer["game_is_active"] == 'false'){
					//если игра окончена, останавляиваем обновление и сообщаем об этом пользователю
					clearInterval(timer);
					step.innerHTML = "";
					wrap_right.style.display = 'block';
					document.getElementById("reload_button").style.display = 'block';
					message_text.innerHTML = answer["message"];

				}
				else{
					if (answer["is_my_step"] == 'false'){
						//если ходит противник, делаем невозможым отправление собственных выстрелов
						wrap_right.style.display = 'block';
						step.innerHTML = "Противник атакует!";
					}
					else{
						//останавливаем таймер проверки
						wrap_right.style.display = 'none';
						step.innerHTML = "В атаку!";
						clearInterval(timer);
					}

					message_text.innerHTML = answer["message"];

					
				}
							

			}
			catch(e){
				//ответ в виде строки
				answer = httpRequest.responseText;
				var message_text = document.getElementById('message_text');
				message_text.innerHTML = answer;
			}
		}
	}
	httpRequest.send();
}

//отправляем значение выстрела
function shoot(num_cell){
	var cell_name = 'enemy_field_' + num_cell;
	var enemy_cell = document.getElementById(cell_name);
	enemy_cell.style.cssText = "background: black;\
					opacity: 0.8;\
					border: 1px solid white;";

	//отправляем значение ячейки
	var data = 'cell='+encodeURIComponent(num_cell);

	//ajax-запрос
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("POST", "/shoot", true);

	 var csrf = getCookie('csrftoken');

    httpRequest.setRequestHeader("X-CSRFToken", csrf);
 
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
 
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


	httpRequest.onreadystatechange = function(){
		if (httpRequest.readyState == 4 && httpRequest.status == 200){
			var answer;
			//проверяем пришел ли ответ в json-форме или в виде строки
			try{
				answer = JSON.parse(httpRequest.responseText);
				var message_text = document.getElementById('message_text');
				var wrap_right = document.getElementById('wrap_right');
				var step = document.getElementById('step');


				if (answer["game_is_active"] == 'false'){
					//если игра окончена, останавляиваем обновление и сообщаем об этом пользователю
					clearInterval(timer);
					step.innerHTML = "";
					document.getElementById("reload_button").style.display = 'block';
					message_text.innerHTML = answer["message"];
					wrap_right.style.display = 'block';
					document.getElementById(cell_name).style.backgroundColor = 'red';

					var imposible_cell = around_cell[num_cell];
							
					for(var i in imposible_cell){
						var imposible_cell_name = 'enemy_field_'+ imposible_cell[i];
						
						var cell_is = document.getElementById(imposible_cell_name);

						if(!(cell_is.style.backgroundColor == 'red') && !(cell_is.style.backgroundColor == 'black')){
							cell_is.style.cssText = "background: grey;\
											opacity: 0.8;\
											border: 1px solid white;";
							
						}
							
					}

				}
				else{

					if (answer["is_my_step"] == 'false'){
						//если ходит противник, делаем невозможым отправление собственных выстрелов
						wrap_right.style.display = 'block';
						step.innerHTML = "Противник атакует!";
						//запускаем таймер проверки
						timer = setInterval(wait_enemy, 2000);
					}
					else{

						//даем пользователю сделать выстрел
						wrap_right.style.display = 'none';
						step.innerHTML = "В атаку!";
						//останавливаем таймер проверки
						clearInterval(timer);

						document.getElementById(cell_name).style.backgroundColor = 'red';

						if(answer['status'] == 'big ship wound'){
							//если пользователь подбил двухпалубный корабль, определяем невозможное расположение второй его части
							enemy_big_ship.push(num_cell);
							var imposible_cell = unaccept_cell[num_cell];

							for(var item in imposible_cell){
								var imposible_cell_name = 'enemy_field_'+ imposible_cell[item];
						
								var cell_is = document.getElementById(imposible_cell_name);
								cell_is.style.cssText = "background: grey;\
								opacity: 0.8;\
								border: 1px solid white;";
							
							}
						}
						else if(answer['status'] == 'big ship kill'){
							//если пользователь добил двухпалубный корабль, определяем невозможное расположение вокруг него
								enemy_big_ship.push(num_cell);
								var imposible_cell = unaccept_cell[num_cell];
							for(var i in enemy_big_ship){
							
								for(var j in around_cell[enemy_big_ship[i]]){

									var imposible_cell_name = 'enemy_field_'+ around_cell[enemy_big_ship[i]][j];
								
									var cell_is = document.getElementById(imposible_cell_name);

									if(!(cell_is.style.backgroundColor == 'red') && !(cell_is.style.backgroundColor == 'black')){
											cell_is.style.cssText = "background: grey;\
											opacity: 0.8;\
											border: 1px solid white;";
							
									}
								}
							
							}
						
						}
						
						else if(answer["status"] == 'small ship kill'){

							//если пользователь подбил однопалубный корабль, определяем невозможное расположение вокруг него

							var imposible_cell = around_cell[num_cell];
							
							for(var i in imposible_cell){
								var imposible_cell_name = 'enemy_field_'+ imposible_cell[i];
						
								var cell_is = document.getElementById(imposible_cell_name);
								cell_is.style.cssText = "background: grey;\
								opacity: 0.8;\
								border: 1px solid white;";
							
							}
						}	
							
						message_text.innerHTML = answer["message"];
					}
				
				}
			}
			catch(e){
				//ответ в виде строки
				 answer = httpRequest.responseText;
				 var message_text = document.getElementById('message_text');
				message_text.innerHTML = answer;
			}
			
		}
	}
	httpRequest.send(data);
}
