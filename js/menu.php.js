//inline js @menu.php    
    var pizzaData = null;
    var open_product_id = null;
    var open_crust_id = null;
    

    
    $(document).ready(function(){
        $('#add-another-pizza').click(function(){
            showPageBlocker();
            check_logic = checkToppingLogic(); 
            if(!check_logic){ hidePageBlocker(); return false; }
            add_status = addToCart();
            return false;
        });

      $('#proceed-to-sides').click(function(){
        showPageBlocker();
        check_logic = checkToppingLogic(); 
        if(!check_logic){ hidePageBlocker(); return false; }
        add_status = addAndProceedSides();
        return false;
      });
        
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
        
        showPageBlocker();                   
        $(".modal").attr('href','#dialog');
        
        
        $.post("viewCartItems.php",{ session_id : $.cookie("session_id")},function(data){
            displayCartItems(eval(data));
        });
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
                      });
                    }
                });
                return false;
            }
        });
        
        $('.proceed-to-sides-link').click(function(){
          if(!pizza_in_cart_flag){
            $.prompt('<h3 style="padding-left:10px;">Add a Pizza.</h3><p style="padding:10px">Please add atleast one pizza before you proceed to sides.</p>');
            return false;
          }
        });
        
    });
    
    var images_basepath = "http://www.dominos-india.com/assets/osc/ABAAA/images/products/originals/";
    
    function buildCategory(cat_ref,data){
      
      html_append = '';
      for(i=0;i<data.length;i++){
          
          if(i==0){
              html_append += '<div class="pizza-details-first-item pizza-details">';
          }
          else{
            html_append += '<div class="pizza-details-item pizza-details">';
          }
          html_append += '<fieldset id="set1" class="tool-tip">';
          html_append += '<a title="'+data[i].product_description+'" >';
          html_append += '<p align="center"><img src="'+image_basepath+data[i].product_image+'" border="0" width="128" height="58" alt="Pizza"></p>';        
          html_append += '<h4>'+data[i].product_name+'</h4>';
          if(typeof data[i]["product_subtitle"] != "undefined" ){
             html_append += '<p>'+data[i].product_subtitle+'</p>';
          }
          html_append += '</a>';
          html_append += '</fieldset>';
          html_append += '<p><a id="pizza_'+data[i].product_id+'" class="modal"><img src="images/custmoize_and_add.png" border="0" width="105" height="21" alt="Custmoize and Add"></a></p>';               
          html_append +='</div>';
      }
      $(cat_ref).append(html_append);
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
        
        $('.tool-tip *').tooltip();
        
        $("a.modal").attr('href','#dialog');
        
        $(".modal").click(function(){
            showPageBlocker();
            pizza_id = $(this).attr("id");
            id = pizza_id.match(/\d+$/);
            id = id[0];
            getPizzaDetails(id);
            
            return false;
        });
        
        hidePageBlocker();            
        
        $(".modal").fancybox({'autoScale': false, 'width':665, 'height': 570, 'autoDimensions': false, 'scrolling': 'no'}); 
    }
    
