var ranges = ['p','q','r','s','t','u','v','w','x','y','z','{','|','}','~'];
var keys = ['=','¡','¢'];
var class_figure_selected = 'btn-primary';

$(function(){

	localStorage.removeItem('range_max');
	localStorage.removeItem('range_min');
	localStorage.removeItem('key');
	localStorage.removeItem('tempo');
	localStorage.removeItem('figures_selected');

	$('body').on('click','.btn-nota',function(){
		var piano = Synth.createInstrument('organ');
		piano.play($(this).data('nota'), 4, 2); // suena la nota en la octava establecida en el segundo parametro por el numero de segundos del tercer parametro	
	})

	$('body').on('click','.btn-figura',function(){
		if($(this).hasClass('btn-secondary')){
			$(this).removeClass('btn-secondary');
			$(this).addClass(class_figure_selected);
		}else{
			$(this).removeClass(class_figure_selected);
			$(this).addClass('btn-secondary');			
		}
	})


	//Subir nivel de un range
	$('body').on('click','.btn-up-range',function(){
		var current_range = $(this).parent().parent().find('.range_selected').html();
		var current_position = ranges.indexOf(current_range);
		if(current_position < ranges.length){
			$(this).parent().parent().find('.range_selected').html(ranges[current_position+1]);
			setValues();
		}
	})

	//Bajar nivel de un range
	$('body').on('click','.btn-down-range',function(){
		var current_range = $(this).parent().parent().find('.range_selected').html();
		var current_position = ranges.indexOf(current_range);
		if(current_position > 0){
			$(this).parent().parent().find('.range_selected').html(ranges[current_position-1]);
			setValues();
		}
	})


	//Subir nivel de key
	$('body').on('click','.btn-up-key',function(){
		var current_key = $(this).parent().parent().find('.key_selected').html();
		var current_position = keys.indexOf(current_key);
		if(current_position < keys.length){
			$(this).parent().parent().find('.key_selected').html(keys[current_position+1]);
			setValues();
		}
	})

	//Bajar nivel de key
	$('body').on('click','.btn-down-key',function(){
		var current_key = $(this).parent().parent().find('.key_selected').html();
		var current_position = keys.indexOf(current_key);
		if(current_position > 0){
			$(this).parent().parent().find('.key_selected').html(keys[current_position-1]);
			setValues();
		}
	})

	$('body').on('change','#tempo',function(){
		setValues();
	})

	$('body').on('click','.btn-figura',function(){
		setValues();
	})
})

function setValues(){
	localStorage.setItem('range_max',$('#range_max').html());
	localStorage.setItem('range_min',$('#range_min').html());
	localStorage.setItem('key',$('#key').html());
	localStorage.setItem('tempo',$('#tempo').val());
	localStorage.setItem('figures_selected',JSON.stringify(notesSelected()));
}

function notesSelected(){
	figures_selected = [];
	$('.btn-figura.'+class_figure_selected).each(function(i,el){
		figures_selected.push($(el).html());
	})

	return figures_selected;
}
