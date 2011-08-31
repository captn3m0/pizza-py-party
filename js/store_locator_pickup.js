//http://www.dominos.co.in/orderonline/js/store_locator_pickup.js
$(document).ready(function()
    {   
        $(".pcities").change(function()
        {
            var id=$(this).val();                    
            var dataString = 'cityid='+ id+'&type=getpStores';  
            $('#blocker').css('display','block');
            $.ajax
            ({
                type: "GET",
                url: "get_locality.php",
                data: dataString,
                cache: false,
                success: function(html)
                {      
                    if(html=="null")
                    {
                       $(".pstore").css("display","none");
                       $(".psublocality").css("display","none");  
                       $(".parea1").css("display","none");  
                       $(".parea2").css("display","none");   
                       $(".selectedStore").css("display","none"); 
                       $('#blocker').css('display','none');
                    }   
                    else
                    {                                         
                        $(".pstore").css("display","block");  
                        $(".psublocality").css("display","none");  
                        $(".parea1").css("display","none");  
                        $(".parea2").css("display","none");  
                        $(".selectedStore").html('');  
                        $(".pstore").html(html);
                        $('#blocker').css('display','none');
                    }   
                }
            });      

        });

    });
    

$(document).ready(function()
    {
        $(".pstore").change(function()
        {                                
            var id = $('.pstore option:selected').val();  
            if($('#rp').val()== 'cot')  
            {
                var dataString = 'storeid='+ id+'&type=getpStoreDetails&rp=cot'; 
            }
            else
            {
                var dataString = 'storeid='+ id+'&type=getpStoreDetails&rp=home'; 
            }
            $('#blocker').css('display','block');   
            $.ajax
            ({
                type: "GET",
                url: "get_locality.php",
                data: dataString,
                cache: false,
                success: function(html)
                {                       
                    if(html=="null")
                    {               
                        $(".storedetails").css({"display":"block","clear":"both"});  
                        $('#blocker').css('display','none');    
                    }
                    else
                    {   
                        $(".selectedStore").css({"display":"block","clear":"both"}); 
                        $(".selectedStore").html(html);  
                        $('#blocker').css('display','none');
                    }
                    
                }
            });

        });  
    
    });
