//http://www.dominos.co.in/orderonline/js/custom_dominos.js
function editCartItem(customer_basket_id){
        $.post('editCartItem.php',{session_id : $.cookie('session_id'), cust_basket_id:customer_basket_id},function(data){
            data = eval(data);
            prep_modal(data.original);
            $('#modal-quantity-item').val(data["default"]["customers_basket_quantity"]);
            
            
            $('#hidden-basket-id').val(data["default"]["customers_basket_id"]);
            product_string = data["default"]["products"];
            product_string = product_string.split('#');
            product_id = product_string[0];
            open_product_id = product_id;
            product_options = product_string[1];
            product_options = product_options.split(',');
            crust_type = product_options[1];
            crust_radios = $('#list1b input[name="attributes_hidden"]');  
            for(i=0 ; i < crust_radios.length; i++){
                if( $(crust_radios[i]).val() == crust_type ){
                    $(crust_radios[i]).siblings('input[type=radio]').click();
                    break;
                }
            }
            
            $('#replace-topping-show').show();
            
            pizza_hidden_attributes = $('#list1a , #extra-cheese-checkbox').find('input[name="hidden_attributes"]');
            pizza_hidden_attributes.siblings('input[type="checkbox"]').attr('checked',false);
            
            
            for(i=1;i<product_options.length;i++){
                for(j=0;j<pizza_hidden_attributes.length;j++){
                    if($(pizza_hidden_attributes[j]).val() == product_options[i]){
                        $(pizza_hidden_attributes[j]).siblings('input[type="checkbox"]').attr('checked',true);
                        break;
                    }
                }
            }
            $('#hidden-unit-price').val(parseInt(data["default"]["final_price"])/parseInt(data["default"]["customers_basket_quantity"]));
            updateModalPrice();
            $('#modal-quantity-item').val(data["default"]["customers_basket_quantity"]);
            $('#remove-topping-title, #default-topping-container').hide();
            hidePageBlocker();
        });
    }
    
    function checkToppingLogic(){
        toppings_number = $('#default-topping-select input[type="checkbox"]').length;
        checked_number = $('#default-topping-select input[type="checkbox"]:checked').length;
        if(toppings_number < 3) {  return true; }
        if(toppings_number == 3){
            if(toppings_number-checked_number > 1){
                $.prompt('<h3 style="padding-left:10px;">Sorry!</h3><p style="padding:10px">You have removed more than 1 of the default toppings</p><p>Please reselect them till only one or none of them are deselected.</p>');
                return false;
                hidePageBlocker();
            }
        }
        else if(toppings_number - checked_number > 2){
                alert("You can remove only 2 toppings");
                return false;
                hidePageBlocker();
           }
        return true;
    }
    
    function editSidesItem(customer_basket_id){
         $.post('editCartItem.php',{session_id : $.cookie('session_id'), cust_basket_id:customer_basket_id},function(data){
            data = eval(data);
            product_string = data["default"]["products"];
            customer_basket_id = data["default"]["customers_basket_id"];
            var item_quantity = prompt("enter new quantity");
            $.post("updateCartItem.php",{pro_string:product_string,session_id:$.cookie('session_id'),basq:item_quantity,cust_basket_id:customer_basket_id},function(data){
                data = eval(data);
                if(data["update_status"]==1){
                    $.fancybox.close();
                    $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(data){
                        displayCartItems(eval(data));
                    });
                } 
            });
         
         });

    }
    
    function addAndProceedSides(){
      if(open_product_id == null){
        return false;
      }


      crust_type = $('#list1b input:checked').siblings('input[name="attributes_hidden"]').val();
      if(typeof crust_type == "undefined"){
        return false;
      }
      
      crust_size = $('#list1b input:checked').siblings('input.hidden-crust-type').val();
      
      product_string = open_product_id+"#"+crust_size+','+crust_type;
      toppings_type = $('#list1a input:checked , .extra-cheese input:checked').siblings('input[name="hidden_attributes"]');
      for(i=0;i< toppings_type.length ;i++){
        product_string +=','+toppings_type[i].value;
      }
      session_id = $.cookie("session_id");
      item_quantity = $('#modal-quantity-item').val();
          $.post("addItemToCart.php",{product:product_string,session_id:session_id,quantity:item_quantity},function(add_data){
            document.location = "sides.php";
        });
        
         return true;
    }
        
    function addToCart(){
        if(open_product_id == null){
            return false;
        }
        crust_size_type = $('#list1b input:checked').siblings('input[name="attributes_hidden"]').val();
        if(typeof crust_size_type == "undefined"){
            return false;
        }

    crust_type = $('#list1b input:checked').siblings('input.hidden-crust-type').val();

        product_string = open_product_id+"#"+crust_type+','+crust_size_type;
        toppings_type = $('#list1a input:checked , .extra-cheese input:checked').siblings('input[name="hidden_attributes"]');
        for(i=0;i< toppings_type.length ;i++){
            product_string +=','+toppings_type[i].value;
        }
        session_id = $.cookie("session_id");
        item_quantity = $('#modal-quantity-item').val();
        $.post("addItemToCart.php",{product:product_string,session_id:session_id,quantity:item_quantity},function(add_data){
            add_data = eval(add_data);
            if(add_data["add_status"]==1){
                
                $.fancybox.close();
                $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(cart_data){
              displayCartItems(eval(cart_data));
              hidePageBlocker();
              
                    
                });
            }
        });
        
        return true;
    }



    
pizza_in_cart_flag = 0;

    function displayCartItems(cart_data){
    pizza_in_cart_flag = 0
        $('#jc-cart').remove();
        html_append = '<div class="cart-list" id="jc-cart"><ul style="float:left;" id="cart_carousel" class="jcarousel-skin-tango"></ul>';
        // html_append += '<div class="carousel_controls"><button class="carousel_up" ></button>';
        // html_append += '<button class="carousel_down" ></button></div></div>'
        $('.cart-details').prepend(html_append);
    
            
        if(typeof cart_data.customer_basket_info == "undefined") { return};
        cart_items = cart_data.customer_basket_info;
        for(i=0;i<cart_items.length;i++){
            if(cart_items[i].products_model == "PIZZA" || cart_items[i].products_model == "COMBO"){
                pizza_in_cart_flag++;
            }
            product_name = cart_items[i].products_name;
            product_name = product_name.replace(/\(\d\)/,"");
            
            html_append = '<li class="cart-item"><div style="width:215px; height:50px;"><div class="edit-remove">';
            html_append += '<input type="hidden" name="hidden_basid" value="'+cart_items[i].customers_basket_id+'" />';
            if(cart_items[i].products_model == "PIZZA" || cart_items[i].products_model == "COMBO"){
                html_append += '<img class="remove-cart-item" style="margin-bottom: 5px;" src="images/remove_from_cart.png" border="0" width="11" height="10" alt="Remove Item"><br />';
            }
            else{
                html_append += '<img class="remove-cart-sides-item" style="margin-bottom: 5px;" src="images/remove_from_cart.png" border="0" width="11" height="10" alt="Remove Item"><br />';
            }    
            if(cart_items[i].products_model == "PIZZA" || cart_items[i].products_model == "COMBO"){
                html_append += '<a class="edit-modal" >';
                html_append += '<img class="edit-cart-item" src="images/edit_cart.png"  border="0" alt="Edit Item">';
                html_append += '</a>';
                full_description = cart_items[i].attributes_details;
                toppings = full_description.substring(0,full_description.indexOf("Size :"));
                pizza_size = full_description.substring(full_description.indexOf("Size :"),full_description.length);
            }
                        
            html_append += '</div>'; 
                       
            
            if(cart_items[i].products_model == "PIZZA"){
                html_append += '<h4>';
                html_append += '<a href="#" class="tooltip" title="'+toppings+'<br />'+pizza_size+'" >';
                //html_append += '<a href="#" class="tooltip" title="'+toppings+'<br />'+pizza_size+'" >';
                html_append += product_name+'&nbsp;&nbsp;&nbsp;&nbsp;('+cart_items[i].customers_basket_quantity+')';
                html_append += '</a>';
                html_append += '</h4>';
            }
            else{
                html_append += '<h4>'+product_name+'&nbsp;&nbsp;&nbsp;&nbsp;('+cart_items[i].customers_basket_quantity+')</h4>';
            }
            html_append += '<div class="item-price">'+cart_items[i].final_price+'</div>';
            html_append += '</div></li>';
            $('#jc-cart ul').append(html_append); 
                  
       }
       
       $('.edit-modal').attr('href','#dialog');
       
       $('.cart-item .tooltip').tooltip().click(function(){
           return false;
       });
       
       $('#coupons-used li').remove();
       
       if(typeof cart_data.product_level_coupon_info != 'undefined'){
           coupon_offers = cart_data.product_level_coupon_info;
           
       
           for(i=0 ; i<coupon_offers.length ; i++){
               html_append = '<li><input type="hidden" name="coupon-id" value="'+coupon_offers[i].product_level_coupon_line_id+'" / >';
               html_append += '<input type="hidden" name="coupon-code" value="'+coupon_offers[i].coupon_code+'" />';
               html_append += '<p><span style="float:left; font-size:11px;">'+coupon_offers[i].coupon_details+'</span> <img class="remove-coupon-offer" style="float:right;" src="images/remove_from_cart.png" border="0" width="11" height="10" alt="Remove Item"></p></li>';
               $('#coupons-used').append(html_append);
           }
           
           $('.remove-coupon-offer').click(function(){
                showPageBlocker();
                var coupon_code = $(this).parent().siblings('input[name="coupon-code"]').val();
                var coupon_id = $(this).parent().siblings('input[name="coupon-id"]').val();
                $.post('reverseCoupons.php',{session_id : $.cookie('session_id'),coupon_code:coupon_code, coupon_id: coupon_id},function(data){
                    $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(data){
                        displayCartItems(eval(data));
                        hidePageBlocker();
                    });
                })
           }).css('cursor','pointer');;

           
       }
       
       
       $(".edit-modal").fancybox({'autoScale': false, 'width':665, 'height': 570, 'autoDimensions': false, 'scrolling': 'no'});
       
       $("#cart_carousel").jcarousel({
            vertical: true,
            scroll: 1,
            visible: 2
        });  
        
        $('#net-price-box').html(cart_data.net_price);
        $('#service-tax-box').html(cart_data.tax_price);
        $('#total-price-box').html(cart_data.total_price);
        
        $('.remove-cart-item').click(function(){
            removeCartItem(this);
        });
        
        $('.remove-cart-sides-item').click(function(){
            removeSidesItem(this);
        });
        
        $('.edit-modal').click(function(){
            showPageBlocker();
            $('#dialog h4:first').html('');
            $('#dialog .pizza-description').html('');
            $('#product-price').html('');
            
            $('#dialog .size-crust').hide();
            $('#dialog .modal-toppings').hide();
            
            $('#add-another-pizza').css('display','none');
            $('#proceed-to-sides').css('display','none');
            $('#done-edit-cart-item').css('display','block');
            
            
            customer_basket_id = $(this).siblings('input[name="hidden_basid"]').val();
            editCartItem(customer_basket_id);
            return false;
        });
        
        /*$('.edit-sides-item').click(function(){
            customer_basket_id = $(this).siblings('input[name="hidden_basid"]').val();
            editSidesItem(customer_basket_id);
        });*/
   }
    
   function removeSidesItem(cart_item) {
      showPageBlocker();
      customer_basket_id = $(cart_item).siblings('input[name="hidden_basid"]').val();
      $.post('cancelCartItem.php',{session_id : $.cookie('session_id'), cust_basket_id:customer_basket_id},function(data){
        $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(data){
          displayCartItems(eval(data));
          hidePageBlocker();
        });
      });
    } 
    
    function makeCrustImage(old_name){
        split_name = old_name.split(".");
        new_name = split_name[0]+".png";
        return new_name;
    }
  
  function crustTypes(crust_options,rel_data){
    
    $(".ui-accordion-content").css("display", "block");
    $("#list1b").accordion("destroy");
    $('#list1b').children().remove();
    for(i=0;i<crust_options["relationship_data"].length;i++){

      html_append = '<a class="tooltip" title="'+crust_options["relationship_data"][i]['options_values_description']+'" >';
      html_append += '<span style="width: 57px; float: left;"><img src="images/'+makeCrustImage(crust_options["relationship_data"][i]['options_values_image'])+'" border="0" width="56" height="52" alt="Classic hand Tossed"></span><span style="padding: 17px 0px 0px 5px; float: left;">'+crust_options["relationship_data"][i]["options_values_name"]+'</span></a><div class="crust-size-select"><h4 id="crust-type-'+crust_options["relationship_data"][i]['options_values_id']+'" >Select Size</h4></div>';
      $('#list1b').append(html_append);
      needed_rel_key = '2#1_'+crust_options["relationship_data"][i]['options_values_id'];
      for(j=0; j < rel_data.length; j++){
        if(rel_data[j]['relationship_key'] == needed_rel_key ){
          needed_size_data = rel_data[j];
          break;
        }
      }
      html_append = '';
      for(j=0 ; j < needed_size_data["relationship_data"].length ; j++ ){
        var crust_size_name = needed_size_data["relationship_data"][j]["options_values_name"];
        if(crust_size_name.indexOf("Regular")>=0){
          size_identifier = "R";
        }
        else if(crust_size_name.indexOf("Medium")>=0){
          size_identifier = "M";
        }
        else {
          size_identifier = "L";
        }
        html_append += '<p><input id="pizza-size-'+needed_size_data["relationship_data"][j]["options_values_id"]+'" class="size-selector" type="radio" name="ht-size">'+needed_size_data["relationship_data"][j]['options_values_name']+'<input name="attributes_hidden" type="hidden" value="'+needed_size_data["relationship_data"][j]['attributes_id']+'"/><input name="price_hidden" type="hidden" value="'+needed_size_data["relationship_data"][j]['options_values_price']+'"/>';
        html_append += '<input type="hidden" class="hidden-crust-size" value="'+size_identifier+'" / >';
        html_append += '<input type="hidden" class="hidden-crust-type" value="'+crust_options["relationship_data"][i]['attributes_id']+'"/ ></p>';
      }
      $('#crust-type-'+crust_options["relationship_data"][i]['options_values_id']).append(html_append);
      $('.size-crust').fadeIn(700);
    }


        $('#list1b .tooltip').tooltip();
        
        $('.size-selector').click(function(){
                var checked = $(this).attr("checked");
                var price_set = $(this).siblings('input[name="price_hidden"]').val();
                if(checked){
                    $('#hidden-unit-price').val(parseInt(price_set));
                    updateModalPrice();
                }
                else{
                    $('#hidden-modal-price').html(0);
                    updateModalPrice();
                }
        });
        
        $('h4 input.size-selector').click(function(){
        var hidden_letter = $(this).siblings('input.hidden-crust-size').val();
        global_crust_size_indicator = hidden_letter;
        child_id = $(this).attr('id');
                child_id = child_id.substr(child_id.length-1);
                parent_id = $(this).parents('h4:first').attr('id');
                parent_id = parent_id.substr(parent_id.length-1);
                topping_rel_key = "3#2_"+child_id;
                toppingsSelect(topping_rel_key);
        });     
        
        jQuery('#list1b').accordion({
                autoheight: false,
                clearStyle: false,
                header: 'a'
        });
                    
    }

var global_crust_size_indicator = "";


    function calcToppingTotal(){
        
        all_default_toppings = $('#default-topping-select input[type="checkbox"]');
        
        default_topping_checked = $('#default-topping-select input[type="checkbox"]:checked');
        
        default_topping_unchecked = $('#default-topping-select input[type="checkbox"]').not(':checked');
        
        highest_price = 0;
        
        if(all_default_toppings.length == 3){
            highest_price = 0;
            for(i=0;i<default_topping_unchecked.length;i++){
                topping_price = parseInt($(default_topping_unchecked[i]).siblings('input[name="hidden_price"]').val());
                if(topping_price > highest_price)
                highest_price = topping_price;
            }
            
        }
        if(all_default_toppings.length > 3){
            first_highest = 0;
            sec_highest = 0;
            for(i=0;i<default_topping_unchecked.length;i++){
                topping_price = parseInt($(default_topping_unchecked[i]).siblings('input[name="hidden_price"]').val());
                if(topping_price > first_highest){
                    sec_highest = first_highest;
                    first_highest = topping_price;
                }
                else if(topping_price > sec_highest){
                    sec_highest = topping_price;
                }
            }
            highest_price = first_highest + sec_highest;
                    
        }
        
        var extra_checked_toppings = $('#veg-topping-select , #nonveg-topping-select , #extra-cheese-checkbox').find('input:checked').siblings('input[name="hidden_price"]');
        total_extra_price = 0;
        for(i=0;i<extra_checked_toppings.length;i++){
            total_extra_price += parseInt($(extra_checked_toppings[i]).val());
        }
        
        if(total_extra_price < highest_price){
            extra_price = 0;
        }
        else{
            extra_price = total_extra_price-highest_price;
        }
        
        crust_price = parseInt($('#list1b input:checked').siblings('input[name="price_hidden"]').val());
        $('#hidden-unit-price').val(parseInt(crust_price+extra_price));
        updateModalPrice();
    }


    pizza_first_open_flag = 0;
    
    function getPizzaDetails(id){
        pizza_first_open_flag = 1;
    
        $('.modal-side-image > img').attr('src',"images/image_loader.gif"); 

        $('#dialog h4:first').html('');
        $('#dialog .pizza-description').html('');
        $('#product-price').html('');
        
        $('.size-crust').css('display','none');
        $('.modal-toppings').css('display','none');
        
        open_product_id = id;
        session_id = $.cookie("session_id");
        $.post("getProductDetails.php",{"session_id" : session_id , "product_id" : id},function(data){

                if(data == 'Session not present'){
            $.prompt('<h3 style="padding-left:10px;">Session Timeout</h3><p style="padding:10px">Sorry your sessions seems to have timed out</p><p>You will now be redirected to the main page.</p>');
                    return;
          }
            data = eval(data);
            prep_modal(data);
          $('#add-another-pizza').css('display','inline');
          $('#proceed-to-sides').css('display','inline');
          $('#done-edit-cart-item').css('display','none');
            $('#list1b input[type="radio"]:first').click();
            $('#hidden-unit-price').val(parseInt($('#list1b input[name="price_hidden"]').val()));
            updateModalPrice();
            $.fancybox.resize();
            hidePageBlocker();
        });
  }
  
  function displayModalImage(image_data){
        $('.modal-side-image > img').attr('src',"http://dominos.wildfirenetworks.in/assets/osc/ABAAA/images/products/originals/"+image_data[1]['product_image']);
  }
  
  function prep_modal(data){
    

    if(typeof data["product_images"][1] != "undefined"){
        displayModalImage(data["product_images"]);  
    }
      
    $('#list1a a:first').click();
    $('#nonveg-topping-link').next('div').hide();
    if(data.product_model == "COMBO"){
        $('#extra-cheese-checkbox').hide();
        $('#nonveg-topping-link').hide();
        $('#veg-topping-link span').html('Extra Cheese');
        $('#veg-topping-link').css('margin-top','10px');
    }
    else{
        $('#extra-cheese-checkbox').show();
        $('#nonveg-topping-link').show();
        $('#veg-topping-link span').html('Veg Toppings');
        $('#veg-topping-link').css('margin-top','0px');
        $('#default-topping-container').hide();
    }
    //$('#list1a a:first').click();
    if(pizza_first_open_flag)   {
        $('#replace-topping-show').show();
        $('#remove-topping-title').hide();
        pizza_first_open_flag = 0;
    }
    
    $('#modal-quantity-item').val(1);
    pizza_data = eval(data);
    pizzaData = pizza_data;
    $('#dialog h4:first').html(pizza_data["product_name"]);
    $('#dialog .pizza-description').html(pizza_data["product_description"]);
    $('#dialog #hidden-unit-price').val(parseInt(pizza_data["product_price"]));
        updateModalPrice();
    product_options = pizza_data["product_options_values"];
        if(product_options.length){
      for(i=0;i<product_options.length;i++){
        if(product_options[i]["relationship_key"]=="1#0_0"){
          main_key = i;
          break;
        }
      }
      main_options = product_options[main_key];
      crustTypes(main_options,pizza_data["product_options_values"]);
      
    }
  }
  
  function toppingsSelect(rel_key){

    if(global_crust_size_indicator == "R"){
      veg_topping_price = 20;
      nonveg_topping_price = 30;
    }
    else if(global_crust_size_indicator == "M"){
      veg_topping_price = 30;
      nonveg_topping_price = 40;
    }
    else{
      veg_topping_price = 50;
      nonveg_topping_price = 60;
    }


    $('.extra-cheese input[type="checkbox"]').attr("checked",false);
    
    $('.modal-toppings').fadeOut(700);
    
    $('#veg-topping-select tbody').children().remove();
    
    $('#nonveg-topping-select tbody').children().remove();
    
    $('#default-topping-select tbody').children().remove();
    
    for(i=0;i<pizzaData["product_options_values"].length;i++){
      if(pizzaData["product_options_values"][i]["relationship_key"]==rel_key){
        toppingsData = pizzaData["product_options_values"][i]["relationship_data"];
        break;
      }
    }
    for(i=0;i<toppingsData.length;i++){
      if(toppingsData[i]["custom_attrib"] == "C" && toppingsData[i]["default_attrib"] == 0){
        $('.extra-cheese input[type="checkbox"]').attr("checked",false);  
        $('.extra-cheese input[name="hidden_price"]').val(toppingsData[i]["options_values_price"]);
        $('.extra-cheese input[name="hidden_attributes"]').val(toppingsData[i]["attributes_id"]);
        continue;
      }
      if(toppingsData[i]["default_attrib"] == 1){
        if(toppingsData[i]["options_values_image"] == "veg.PNG") topping_price = veg_topping_price; else topping_price = nonveg_topping_price;
        $('#default-topping-select tbody').append('<tr><td class="topping-name">'+toppingsData[i]["options_values_name"]+'</td><td class="topping-check"><input name="hidden_attributes" type="hidden" value="'+toppingsData[i]["attributes_id"]+'" / ><input name="hidden_price" type="hidden" value="'+topping_price+'" / ><input class="toppings-check" checked="checked" type="checkbox"></td></tr>');
      }
      else if(toppingsData[i]["options_values_image"] == "veg.PNG"){
          $('#veg-topping-select tbody').append('<tr><td class="topping-name">'+toppingsData[i]["options_values_name"]+'</td><td class="topping-check"><input class="toppings-check" type="checkbox"><input name="hidden_attributes" type="hidden" value="'+toppingsData[i]["attributes_id"]+'" / ><input name="hidden_price" type="hidden" value="'+toppingsData[i]["options_values_price"]+'" / ></td></tr>');
      }
      else if (toppingsData[i]["options_values_image"] == "non_veg.PNG"){
              $('#nonveg-topping-select tbody').append('<tr><td class="topping-name">'+toppingsData[i]["options_values_name"]+'</td><td class="topping-check"><input  class="toppings-check" type="checkbox"><input name="hidden_attributes" type="hidden" value="'+toppingsData[i]["attributes_id"]+'" / ><input name="hidden_price" type="hidden" value="'+toppingsData[i]["options_values_price"]+'" / ></td></tr>');
      }     
    }
    $('#list1a table tbody tr:odd').children('td').addClass('odd-row');
    $('#list1a table tbody tr:even').children('td').addClass('even-row');
    $('.modal-toppings').fadeIn(700);
    $('.toppings-check').click(function(){
      calcToppingTotal();
    });
        
        default_toppings = $('#default-topping-select input[type="checkbox"]');
        if(default_toppings.length < 3){
            /*$('#default-topping-select').hide();
            $('#remove-topping-title').hide();*/
            $('#replace-topping-show').hide();
        }
        else{
            /*$('#default-topping-select').show();
            $('#remove-topping-title').show();*/
            if(!$('#remove-topping-title').is(':visible')){
                $('#replace-topping-show').show();  
            }
        }
  }

  function showPageBlocker(){
        $("#blocker").fadeIn(200).css('height',$(document).height());  
        $("#blocker .loading").css({'top':($(window).height()/2)+'px','position':'fixed'});
  }
    
  function hidePageBlocker(){
        $("#blocker").fadeOut(200);  
  }
    
    function updateModalPrice(){
      quantity = $('#modal-quantity-item').val();
      unit_price = $('#hidden-unit-price').val();
      
      $('#product-price').html(quantity*unit_price);
  }

$(document).ready(function(){
    $('#replace-topping-show').click(function(){
        $(this).hide();
        $('#remove-topping-title').fadeIn(500,function(){
            $(this).click();
        });
    });
});

