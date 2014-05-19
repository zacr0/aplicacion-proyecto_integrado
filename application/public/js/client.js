$(function() {
	$('#fecha-nacimiento').datepicker({
		format: 'dd/mm/yyyy',
		endDate: new Date($.now()),
		startDate: new Date('01/01/1970'),
		language: 'es',
		minViewMode: 'days',
		weekStart: 1,
		autoclose: true
	});

	$('.visible-alumno').hide();
	$('.visible-profesor').hide();

	$('input[name=perfil]').click(function () {
		if (this.id == "alumno") {
			$(".visible-alumno").show();
			$(".visible-profesor").hide();
		} 
		if (this.id == "profesor") {
			$(".visible-profesor").show();
			$(".visible-alumno").hide();
		}
	});
});