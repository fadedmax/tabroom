
/************************************************ 
*  jQuery iphoneSwitch plugin                   *
*                                               *
*  Author: Daniel LaBare                        *
*  Date:   2/4/2008                             *
************************************************/

jQuery.fn.iphoneSwitch = function(start_state, switched_on_callback, switched_off_callback, options) {

var state = start_state == 'on' ? start_state : 'off'; 

var settings = { 
	mouse_over                : 'pointer',
	mouse_out                 : 'default',
	switch_on_container_path  : '/lib/images/iphone_switch_container_off.png',
	switch_off_container_path : '/lib/images/iphone_switch_container_off.png',
	switch_path               : '/lib/images/iphone_switch.png',
	switch_height             : 20,
	switch_width              : 64
};

if(options) { jQuery.extend(settings, options); }

return this.each(function() { var container; var image; container = jQuery('<div class="iphone_switch_container" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; position: relative; overflow: hidden"></div>'); image = jQuery('<img class="iphone_switch" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; background-image:url('+settings.switch_path+'); background-repeat:none; background-position:'+(state == 'on' ? 0 : -35)+'px" src="'+(state == 'on' ? settings.switch_on_container_path : settings.switch_off_container_path)+'" /></div>'); jQuery(this).html(jQuery(container).html(jQuery(image))); jQuery(this).mouseover(function(){ jQuery(this).css("cursor", settings.mouse_over); }); jQuery(this).mouseout(function(){ jQuery(this).css("background", settings.mouse_out); }); jQuery(this).click(function() { if(state == 'on') { jQuery(this).find('.iphone_switch').animate({backgroundPosition: -35}, "slow", function() { jQuery(this).attr('src', settings.switch_off_container_path); switched_off_callback(); }); state = 'off'; } else { jQuery(this).find('.iphone_switch').animate({backgroundPosition: 0}, "slow", function() { switched_on_callback(); }); jQuery(this).find('.iphone_switch').attr('src', settings.switch_on_container_path); state = 'on'; } });		}); };

