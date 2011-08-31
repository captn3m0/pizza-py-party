//inline js @sides.php

    $(function() {
        
        $('#redeem-coupon-button').click(function(data){
            
            var coupon_code = $('#coupon-code-field').val();
                  
            var coupon_pattern = /^[a-zA-Z0-9]+$/;
            if(coupon_pattern.test(coupon_code)== false)
            {
                $.prompt('<h3 style="padding-left:10px;">Error!</h3><p style="padding:10px">Coupon Code should contain only alpha-numeric characters</p>')
            }
            else
            {
            showPageBlocker();
            var coupon_code = $('#coupon-code-field').val();
            $.post('redeemCoupon.php',{session_id:$.cookie('session_id'),coupon_code : coupon_code}, function(coupon_data){
                if(coupon_data.status == 0){
                  hidePageBlocker();
                  $.prompt('<h3 style="padding-left:10px;">Invalid Coupon</h3><p style="padding:10px">'+coupon_data.message+'</p>');
                  return;
                }
                else{
                      $.post("viewCartItems.php",{ session_id : $.cookie("session_id")},function(data){
                      displayCartItems(eval(data));
                      hidePageBlocker();
                      $.prompt('<h3 style="padding-left:10px;">Coupon Added Successfully</h3><p style="padding:10px">'+coupon_data.message+'</p>');
                  });
                }
            });
            return false;
        }
        });
        
        
        /*$("#deals").jcarousel({
            vertical: true,
            scroll: 1,
            visible: 2
        });*/
    $(".modal").fancybox({'autoScale': false, 'width':665, 'height': 570, 'autoDimensions': false, 'scrolling': 'no'});     
        
    });
   var image_basepath = "http://www.dominos-india.com/assets/osc/ABAAA/images/products/originals/";
   var build_done = {
    "pasta": 0,
    "breads":0,
    "dips": 0,
    "beverages":0,
    "more":0
   };
   $(document).ready(function(){
        showPageBlocker();
        jQuery().ready(function(){
            jQuery('#list1a').accordion({
                autoheight: false,
                clearStyle: true,
                header: 'a'
            });
    
            jQuery('#list1b').accordion({
                autoheight: false,
                clearStyle: true,
                header: 'a'
            });
        }); 

       
       var pasta_cat_id = 23;
       var bread_cat_id = 24;
       var dip_cat_id = 25;
       var beverage_cat_id = 5;
       var more_cat_id = 26;
       
       $.post('getProductList.php', { session_id : $.cookie("session_id"), category_id: pasta_cat_id }, function(data){
            buildCategory($('#pasta-listing'),data);
            build_done["pasta"] = 1;
            checkPageLoaded();
       });
       
       $.post('getProductList.php', { session_id : $.cookie("session_id"), category_id: bread_cat_id }, function(data){
            buildCategory($('#breads-listing'),data);
            build_done["breads"] = 1;
            checkPageLoaded();
       });
       
       $.post('getProductList.php', { session_id : $.cookie("session_id"), category_id: dip_cat_id }, function(data){
            buildCategory($('#dips-listing'),data);
            build_done["dips"] = 1;
            checkPageLoaded();
       });
       
       $.post('getProductList.php', { session_id : $.cookie("session_id"), category_id: beverage_cat_id }, function(data){
            buildCategory($('#beverages-listing'),data);
            build_done["beverages"] = 1;
            checkPageLoaded();
       });
       
       $.post('getProductList.php', { session_id : $.cookie("session_id"), category_id: more_cat_id }, function(data){
            buildCategory($('#more-listing'),data);
            build_done["more"] = 1;
            checkPageLoaded();
       });
       
       $(document).ready(function(){
        $.post("viewCartItems.php",{ session_id : $.cookie("session_id")},function(data){
            displayCartItems(data);
            hidePageBlocker();
        });
    
    $('.extra-cheese input[type="checkbox"]').click(function(){
        var checked = $(this).attr("checked");
        var topping_price = $(this).siblings('input[name="hidden_price"]').val();
        if(checked){
          new_topping_price = parseInt($('#hidden-unit-price').val()) + parseInt(topping_price);
          $('#hidden-unit-price').val(new_topping_price);
        } 
        else{
          new_topping_price = parseInt($('#hidden-unit-price').val()) - parseInt(topping_price)
          $('#hidden-unit-price').val(new_topping_price);
        }
        updateModalPrice();
    });

    });
       
   });
   
    
   function removeCartItem(cart_item) {
      if(pizza_in_cart_flag <= 1){
        $.prompt('<h3 style="padding-left:10px;">Cannot Remove Pizza</h3><p style="padding:10px">You cannot remove all pizzas.</p>');        
        return false;
      }
      showPageBlocker();
      customer_basket_id = $(cart_item).siblings('input[name="hidden_basid"]').val();
      $.post('cancelCartItem.php',{session_id : $.cookie('session_id'), cust_basket_id:customer_basket_id},function(data){
        $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(data){
          displayCartItems(eval(data));
          hidePageBlocker();
        });
      });
    }
   
   
   function buildCategory(catdiv_ref,data){
       for(i=0;i<data.length;i++){
          
          if(i==0){
              html_append = '<div class="pizza-details-first-item pizza-details">';
          }
          else{
            html_append = '<div class="pizza-details-item pizza-details">';
          }
          html_append += '<p align="center">';
          html_append += '<img src="'+image_basepath+data[i].product_image+'" border="0" width="128" height="58" / ></p>';
          html_append += '<div class="alignleft" style="width:165px;">';
          
          html_append += '<div class="sides_title" >';
          html_append += '<h4>'+data[i].product_name+'</h4>';
          html_append += '<p>Rs '+data[i].product_price+'/-only!</p></div>'; //for side titles
          
          html_append += '<p style="margin-top: 5px; float:left;">';
          
          html_append += '<span class="sides-qty">Qty: </span>';
          
          html_append += '<div class="spinner alignleft">';
          html_append += '<form class="alignleft" ><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>';
          html_append += '<td rowspan="2"><input size="3" class="sides-quantity-field" type="text" onblur="if(this.form.number.value < 1){this.form.number.value = 1;}" value="1" name="number" class="order_quantity" disabled="disabled"></td>';
          html_append += '<td><input type="button" onclick="this.form.number.value++;" class="spinner_up" name="up"></td></tr><tr><td><input type="button" onclick="if(this.form.number.value!=1){this.form.number.value--;}" class="spinner_down" name="down"></td>';
          html_append += '</tr></tbody></table></form>';
                    
          html_append += '<span style="padding:5px 0 0 5px;float: left;"><a class="add-sides-button" href="#">';
          html_append += '<input class="hidden-product-id" type="hidden" value="'+data[i].product_id+'" / >';
          html_append += '<img src="images/add_sides.png" border="0" width="34" height="14" alt="Add">';
          html_append += '</a></span>';
          
          html_append += '</div></p>'; //for spinner
          
          html_append += '</div>'; //for alignleft
          html_append += '</div>'; //for the pizza item
          
          $(catdiv_ref).append(html_append);
       }
       
   }
   
   function checkPageLoaded(){
       flag = 0;
        for(keys in build_done){
            if(build_done[keys] == 0){
                flag = 1;
                break;
            }
        }
        if(flag == 1){
            return;
        }
        $(".add-sides-button").click(function(){
            showPageBlocker();
           var quantity = $(this).parents('.spinner').find('.sides-quantity-field').val();
           var product_id = $(this).find('.hidden-product-id').val();
           $.post('addItemToCart.php',{product: product_id, session_id: $.cookie("session_id"),quantity:quantity},function(data){
                $.post("viewCartItems.php",{ session_id : $.cookie("session_id")},function(data){
                    displayCartItems(data);
                    hidePageBlocker();
                });
           });
           return false;
       });
    }
    
    var pizzaData = null;
    var open_product_id = null;
    var open_crust_id = null;
    
    
   
    
    $(document).ready(function(){
         $('#done-edit-cart-item').click(function(){
            showPageBlocker();
            if(!checkToppingLogic()) return;
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
            var customer_basket_id = $(this).siblings('#hidden-basket-id').val();
         
            
            
            $.post("updateCartItem.php",{pro_string:product_string,session_id:session_id,basq:item_quantity,cust_basket_id:customer_basket_id},function(data){
                data = eval(data);
                if(data["update_status"]==1){
                    $.fancybox.close();
                    $.post("viewCartItems.php",{session_id:$.cookie("session_id")},function(data){
                        displayCartItems(eval(data));
                        hidePageBlocker();
                    });
                }
            });
            
        });
    });
