module.exports = function(grunt) {
    var config = {
        controller: './app/js/controllers/',
        minCon: './app/js/min-controller/',
        css: './app/css/'
    }

    grunt.initConfig({
        config: config,
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: './app/less', //less文件的位置
                    src: ['**/*.less'],  //目标文件
                    dest: './app/css', //编译完成的css的位置
                    ext: '.css'   //编译完成的文件后缀名
                }]
            }
        },
        watch: {
            options: {
                livereload: true   //浏览器实时刷新
            },
            scripts: {
                files: ['./app/less/**/*.less', './app/views/**/*.html', './app/index.html'],  //实时刷新的监听文件
                tasks: ['less'], //监听到以上文件发生变化就执行less任务
                options: {
                    spawn: false,
                },
            },
        },
        connect: {
            server: {
                options: {
                    protocol: 'http',
                    port: 8000,
                    // keepalive: true,
                    //base: ['app/']  //注意根目录的配置
                }
            }
        },
        // concat: {
        //     operate: {
        //         src: ['<%= config.controller %>home/home.js', '<%= config.controller %>home/service.js','<%= config.controller %>home/login.js','<%= config.controller %>home/apply.js','<%= config.controller %>home/calendar.js', '<%= config.controller %>home/editNotice.js'],
        //         dest: '<%= config.minCon %>home.js'
        //     }
        // },
        // concat: {
        //     operate: {
        //         src: ['<%= config.controller %>analysis/analysis.js', '<%= config.controller %>analysis/service.js','<%= config.controller %>analysis/controller.js'],
        //         dest: '<%= config.minCon %>analysis.js'
        //     }
        // },

        // concat: {
        //     operate: {
        //         src: ['<%= config.controller %>educate/educate.js', '<%= config.controller %>educate/service.js','<%= config.controller %>educate/attendance.js','<%= config.controller %>educate/course.js','<%= config.controller %>educate/stuInfo.js'],
        //         dest: '<%= config.minCon %>educate.js'
        //     }
        // },
        // concat: {
        //     operate: {
        //         src: ['<%= config.controller %>finance/finance.js', '<%= config.controller %>finance/service.js','<%= config.controller %>finance/applicate.js','<%= config.controller %>finance/income.js','<%= config.controller %>finance/pay.js'],
        //         dest: '<%= config.minCon %>finance.js'
        //     }
        // },
        // concat: {
        //     operate: {
        //         src: ['<%= config.controller %>student/student.js', '<%= config.controller %>student/service.js','<%= config.controller %>student/attendance.js','<%= config.controller %>student/course.js','<%= config.controller %>student/schoolbus.js', '<%= config.controller %>student/stuInfo.js'],
        //         dest: '<%= config.minCon %>student.js'
        //     }
        // },

        // concat: {
        //     operate: {
        //         src: ['<%= config.controller %>public/directive.js', '<%= config.controller %>public/filter.js','<%= config.controller %>public/service.js'],
        //         dest: '<%= config.minCon %>public.js'
        //     }
        // },

        concat: {
            operate: {
                src: ['./app/js/app.js', './app/js/public/Util.js', '<%= config.minCon %>public.js', '<%= config.minCon %>home.js', '<%= config.minCon %>operating.js', '<%= config.minCon %>student.js', '<%= config.minCon %>educate.js', '<%= config.minCon %>analysis.js', '<%= config.minCon %>finance.js'],
                dest: '<%= config.minCon %>main.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= config.css %>',
                    src: ['main.css'],
                    dest: '<%= config.css %>',
                    ext: '.min.css'
                }]
            }
        },
        uglify: {
            my_target: {
                files: {
                    '<%= config.minCon %>main.min.js': ['<%= config.minCon %>main.js']
                }
            }
        }

    });
 
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['connect', 'watch']);
}