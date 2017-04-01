$(function () {
   $('.searchBtn').click(function () {
       var $val = $('.searchBox').val();
       $.ajax({
           "url": "script/commodityInformation.json",
           "success": function (result) {
               for (var i=0;i<result.length;i++){
                   if(result[i].bookName.indexOf($val) != -1) {

                       var costN = result[i].cost.split('.');
                       var cost1 = costN[0].split('');
                       var integer = cost1[1]+cost1[2];
                       var cost2 = costN[1].split('');
                       var decimals = cost2[0]+cost2[1];
                       var fullNum = parseFloat((integer + '.' + decimals)).toFixed(2);

                       var $ele = '<div class="searchBox">' +
                                  '<dl>' +
                                  '<dt>' +
                                  '<a href="#"><img src="'+result[i].smallImg+'"/></a>' +
                                  '<dt>' +
                                  '<dd>' +
                                  '<span>'+result[i].bookName+'</span>' +
                                  '<strong>'+result[i].cost+'</strong>' +
                                  '</dd></dl>' +
                                  '<div class="buyNow">' +
                                  '<a href="#" class="btn btn-1 btn-1a cd-add-to-cart" data-price="'+fullNum+'">加入购物车</a>' +
                                  '</div></div>'
                       $('.searchResult').append($ele)
                   } else if (result[i].author.indexOf($val) != -1) {
                       var costN = result[i].cost.split('.');
                       var cost1 = costN[0].split('');
                       var integer = cost1[1]+cost1[2];
                       var cost2 = costN[1].split('');
                       var decimals = cost2[0]+cost2[1];
                       var fullNum = parseFloat((integer + '.' + decimals)).toFixed(2);

                       var $ele = '<dl>' +
                           '<dt>' +
                           '<a href="bookDetails.html"><img src="'+result[i].smallImg+'"/></a>' +
                           '</dt>' +
                           '<dd>' +
                           '<h4><a href="bookDetails.html">'+result[i].bookName+'</a></h4>' +
                           '<p></p>' +
                           '<div class="moneyCorrelation">' +
                           '<strong>￥<span>'+fullNum+'</span>元</strong>' +
                           '<div class="buyNow">' +
                           '<a href="javascript:;" class="btn btn-1 btn-1a cd-add-to-cart" data-price="33.80">加入购物车</a>' +
                           '</div>';
                       console.log($ele)
                       $('.searchResult').append($ele)
                   }
               }
           }
       })
   })
});