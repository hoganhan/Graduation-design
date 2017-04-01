$(function () {
    var app = {
        init: function () {
            this.validation();
        },
        validation:function () {
            var storage = window.localStorage;
            var userInfo = storage.getItem("user");
            userInfo = userInfo ? JSON.parse(userInfo) : {};
            $('#userBtn').click(function () {

                if (storage.getItem('user')) {
                    var userObj = JSON.parse(storage.getItem('user'));

                    if ($('.userName').val() == '') {
                        $.notify({
                            // options
                            message: '请输入用户名'
                        },{
                            // settings
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "center"
                            },
                            animate: {
                                enter: 'animated fadeInDown',
                                exit: 'animated fadeOutUp'
                            },
                        });
                        return false;
                    }

                    if ($('.userPassword').val() == '') {
                            $.notify({
                                // options
                                message: '请输入密码'
                            },{
                                // settings
                                type: 'danger',
                                placement: {
                                    from: "top",
                                    align: "center"
                                },
                                animate: {
                                    enter: 'animated fadeInDown',
                                    exit: 'animated fadeOutUp'
                                },
                            });
                            return false;
                    }



                    for (var i in userObj) {


                        if ($('.userName').val() == i) {
                            $.notify({
                                // options
                                message: '已存在相同用户名'
                            },{
                                // settings
                                type: 'danger',
                                placement: {
                                    from: "top",
                                    align: "center"
                                },
                                animate: {
                                    enter: 'animated fadeInDown',
                                    exit: 'animated fadeOutUp'
                                },
                            });
                            return false;
                        }
                    }
                }

                //存储用户信息
                userInfo[$('.userName').val()] = $('.userPassword').val();
                storage.setItem('user',JSON.stringify(userInfo));

                $.notify({
                    // options
                    message: '欢迎您 '+$('.userName').val()+' 正在为您跳转到登陆页面'
                },{
                    // settings
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                });
                setTimeout(function () {
                    window.location.href = 'login.html';
                },2000);

            })
        }
    }
    app.init()
})
