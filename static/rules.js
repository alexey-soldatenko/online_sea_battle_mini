var my_count = 0;
var my_disposition = [];
var ready_answer;

	function add_cell(id_cell){
		/*занятие позиции*/
		var cell = document.getElementById(id_cell);

		var cell_array = id_cell.split('_');
		/*определяем номер ячейки*/
		var number_cell = Number(cell_array[cell_array.length-1]);

		if ((cell.style.backgroundColor == '' || cell.style.backgroundColor == 'white') && (my_count < 3)){
			cell.style.background = 'red';
			my_count += 1;
			/*проверяем есть ли уже данная ячейка в массиве,
			если нет - добавляем*/
			if ((my_disposition.indexOf(number_cell)) == -1){
				my_disposition.push(number_cell);
			}
			
		}
		else if(cell.style.backgroundColor == 'red'){
			my_count -= 1;
			cell.style.background = 'white';
			var num = my_disposition.indexOf(number_cell);
			if (num > -1){		
				my_disposition.splice(num, 1);
			}
			var submit = document.getElementById('fix_position');
				submit.disabled = true;
				submit.style.background = "inherit";
				submit.style.color = "white";
				submit.style.cursor = "inherit";
				submit.innerHTML = "Занять позиции"
		}
		if (my_count == 3){
			ready_answer = rules();
			if (ready_answer[0] == true){
				var submit = document.getElementById('fix_position');
				submit.disabled = false;
				submit.style.background = "#FFFFE0";
				submit.style.color = "black";
				submit.style.cursor = "pointer";
				submit.innerHTML = "Начать игру";

				
			}
			
		}
		
		
	}

	function rules(){
/*проверка занятых позиций на соответствие правилам*/

		var answer;

		/*упорядочиваем позиции по убыванию*/
		my_disposition.sort(function(a, b){return b - a});

		/*среди занятых ячеек ищем сначала двухпалубный корабль,
		после чего проверяем в правильном ли месте находится однопалубный
		корябль.*/
		for (var i = 0; i < my_disposition.length; i++){
			if (i == 2){
				answer = big_ship(my_disposition[0], my_disposition[2]);
				if (answer){
					var big = [my_disposition[0], my_disposition[2]]
					if (find_small_ship(big, my_disposition[1])){

						return [true, big, my_disposition[1]];

					}
					else{
						return [false];
					}
					break;
				}
			}
			else{
				answer = big_ship(my_disposition[i], my_disposition[i+1]);
				if (answer){
					var big = [my_disposition[i], my_disposition[i+1]]
					if (i == 0){
						if (find_small_ship(big, my_disposition[2])){

							return [true, big, my_disposition[2]];
							
						}
						else{
						return [false];
					}
					}
					else if (i == 1){
						if (find_small_ship(big, my_disposition[0])){

							return [true, big, my_disposition[0]];

						}
						else{
						return [false];
					}
					}			
					break;
				}
			}
		}
		
		return [false];

	}

	function is_array(num, array){
		/*проверяем значение на вхождение в массив, а также 
		на вхождение в допустимый диапазон ячеек. Функция возвращает true,
		если входит в массив или выходит за пределы допустимых значений.*/
		if ((array.indexOf(num) > -1) || (num > 16) || (num < 1)){
			return true;
		}
		else{
			return false;
		}
	}

	function find_small_ship(big, other){
		/*функция для проверки правильности расположения малого корабля*/

		/*ячейки, которые являются недопустимыми для 
		расположения малого корабля*/
		var disabled_cell = [];

		var top = [2, 3];
		var left = [1, 5, 9, 13];
		var right = [4, 8, 12, 16];
		var bottom = [14, 15];

		/*для каждой ячейки большого корабля определяем диапазон
		 недопустимых ячеек для расположения там однопалубного корабля, и загружаем полученные "запрещенные" ячейки в общий массив.*/
		for (var i = 0; i < 2; i++){
			if (top.indexOf(big[i]) > -1){
				if(!(is_array(big[i]+1, disabled_cell))){
					disabled_cell.push(big[i]+1);
				}
				if(!(is_array(big[i]-1, disabled_cell))){
					disabled_cell.push(big[i]-1);
				}
				if(!(is_array(big[i]+3, disabled_cell))){
					disabled_cell.push(big[i]+3);
				}
				if(!(is_array(big[i]+4, disabled_cell))){
					disabled_cell.push(big[i]+4);
				}
				if(!(is_array(big[i]+5, disabled_cell))){
					disabled_cell.push(big[i]+5);
				}
			}
			else if (bottom.indexOf(big[i]) > -1){
				if(!(is_array(big[i]+1, disabled_cell))){
					disabled_cell.push(big[i]+1);
				}
				if(!(is_array(big[i]-1, disabled_cell))){
					disabled_cell.push(big[i]-1);
				}
				if(!(is_array(big[i]-3, disabled_cell))){
					disabled_cell.push(big[i]-3);
				}
				if(!(is_array(big[i]-4, disabled_cell))){
					disabled_cell.push(big[i]-4);
				}
				if(!(is_array(big[i]-5, disabled_cell))){
					disabled_cell.push(big[i]-5);
				}
			}
			else if (left.indexOf(big[i]) > -1){
				if(!(is_array(big[i]+1, disabled_cell))){
					disabled_cell.push(big[i]+1);
				}
				if(!(is_array(big[i]-3, disabled_cell))){
					disabled_cell.push(big[i]-3);
				}
				if(!(is_array(big[i]-4, disabled_cell))){
					disabled_cell.push(big[i]-4);
				}
				if(!(is_array(big[i]+4, disabled_cell))){
					disabled_cell.push(big[i]+4);
				}
				if(!(is_array(big[i]+5, disabled_cell))){
					disabled_cell.push(big[i]+5);
				}
			}
			else if (right.indexOf(big[i]) > -1){
				if(!(is_array(big[i]-1, disabled_cell))){
					disabled_cell.push(big[i]-1);
				}
				if(!(is_array(big[i]-4, disabled_cell))){
					disabled_cell.push(big[i]-4);
				}
				if(!(is_array(big[i]-5, disabled_cell))){
					disabled_cell.push(big[i]-5);
				}
				if(!(is_array(big[i]+3, disabled_cell))){
					disabled_cell.push(big[i]+3);
				}
				if(!(is_array(big[i]+4, disabled_cell))){
					disabled_cell.push(big[i]+4);
				}
			}
			else{
				if(!(is_array(big[i]+1, disabled_cell))){
					disabled_cell.push(big[i]-1);
				}
				if(!(is_array(big[i]+1, disabled_cell))){
					disabled_cell.push(big[i]+1);
				}
				if(!(is_array(big[i]-5, disabled_cell))){
					disabled_cell.push(big[i]-5);
				}
				if(!(is_array(big[i]-4, disabled_cell))){
					disabled_cell.push(big[i]-4);
				}
				if(!(is_array(big[i]-3, disabled_cell))){
					disabled_cell.push(big[i]-3);
				}
				if(!(is_array(big[i]+5, disabled_cell))){
					disabled_cell.push(big[i]+5);
				}
				if(!(is_array(big[i]+4, disabled_cell))){
					disabled_cell.push(big[i]+4);
				}
				if(!(is_array(big[i]+3, disabled_cell))){
					disabled_cell.push(big[i]+3);
				}
			}
		}
		
		/*проверяем входит ли ячейка однопалубного корабля в массив 
		запрещенных ячеек*/
		if (disabled_cell.indexOf(other) == -1){
			return true;
		}
		else{
			return false;
		}

	}

	function big_ship(a, b){
		/*определяем правильность расположения двухпалубного корабля.*/

		/*ошибочное расположение для старшей ячейки, для горизонтального расположения (error_1) и вертикального (error_4)*/
		var error_1 = [1, 5, 9, 13];
		var error_4 = [1, 2, 3, 4];

		/*ячейки двухпалубного корабля распологаются строго вертикально
		 или горизонтально, т.е. разница между ними будет 4 и 1 соответственно.
		 Но есть ряд исключений для старшей ячейки корабля, в которых теряется логика "неразрывности корабля". */
		if (((a - b) == 1) && (error_1.indexOf(a) == -1)){
			return true;
		}
		else if(((a - b) == 4) && (error_4.indexOf(a) == -1)){
			return true;
		}
		else{
			return false;
		}
	}