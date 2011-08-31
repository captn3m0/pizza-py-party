//http://www.dominos.co.in/orderonline/js/populateMenu.js
var populateMenu = {};
populateMenu = {
	evaluateJSON : function ()	{
		populateMenu.outputJSON = eval(json_data);
	},
	outputJSON : null,
	createListing : function ()	{
		ref_menu = $('.menu-content .menu');
		counter = 0;
		for(keycategory in populateMenu.outputJSON)	{
			ref_menu.append('<div class="pizza-listing" ></div>');
			listing_ref = $('.pizza-listing:eq('+counter+')');
			listing_ref.append('<div class="pizza-category" ></div>');
			cat_ref = listing_ref.children('.pizza-category').addClass(keycategory);
			
			subkeycount = 0;
			for(keysubcat in populateMenu.outputJSON[keycategory])	{
				listing_ref.append('<div class="pizza-details" ></div>');
				if(subkeycount == 0)	{
					details_ref = listing_ref.children('.pizza-details').addClass('pizza-details-first-item');
				}
				else
				{
					details_ref = listing_ref.children('.pizza-details:eq('+subkeycount+')').addClass('pizza-details-item');
				}
				details_ref.append('<fieldset class="tool-tip"><a></a></fieldset>');
				
				link_ref = details_ref.children('.tool-tip').children('a');
				link_ref.attr('title',populateMenu.outputJSON[keycategory][keysubcat]['description']);
				
				para_ref = details_ref.children('.tool-tip').children('a').append('<p align="center"></p>').children('p');
				img_ref = para_ref.append('<img width="128" height="58" border="0" alt="" />').children('img');
				img_ref.attr('src',populateMenu.outputJSON[keycategory][keysubcat]['image']);
				
				link_ref.append('<h4></h4>').children('h4').append(populateMenu.outputJSON[keycategory][keysubcat]['name']);
				link_ref.append('<p class="pizza-size" ></p>').children('p.pizza-size').append(populateMenu.outputJSON[keycategory][keysubcat]['prices']);
				
				details_ref.append('<p class="buttonp" ><a class="modal" href="#dialog"></a></p>');
				details_ref.children('.buttonp').children('.modal').append('<img width="105" height="21" border="0" alt="Custmoize and Add" src="images/custmoize_and_add.png">');
				
				subkeycount++;
			}
			counter++;
		}
		$('.tool-tip *').tooltip();
	}
};
