<template>

  <div class="app-container">
    讲师添加

        <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>


<script>

import teacherApi from '@/api/edu/teacher'
//上传组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'


export default {

    components: { ImageCropper, PanThumb },
    data(){
        return{
            teacher:{//下面属性不加也行
                name: '',
                sort: 1,
                level: 1,
                career: '',
                intro: '',
                avatar: ''
            },

            //上传弹框组件是否显示
            imagecropperShow:false,
            //唯一标识
            imagecropperKey:0,
            BASE_API: process.env.BASE_API, // 接口API地址
            saveBtnDisabled:false// 保存按钮是否禁用
        }
    },

    created(){
      this.init()
    },

    watch: {//监听
      $route(to, from) {//路由变化的方式,每次发生变化都会调用该方法
      this.init()
      }
    },

    methods: {
        init(){
              //判断路径是否有id值
            if (this.$route.params && this.$route.params.id) {
                //从路径获取id值
                const id = this.$route.params.id
                //调用根据id查询的方法
                this.getTeacherInfo(id)
            }else {//路径没有id值时，做添加操作，需要清空表单，
                      this.teacher = {}
                  }
        },


        //想把添加和删除做在一个页面中
        saveOrUpdate(){
            //判断是添加操作还是修改操作
            //根据teacher中是否有id进行判断
            if(!this.teacher.id){
                this.saveTeacher()
            }else{
                this.updateTeacher()
            }
           
      
        },

        //根据讲师id查询的方法
        getTeacherInfo(id){
            teacherApi.getTeacherInfo(id)
            .then(response =>{
                this.teacher = response.data.teacher
            })
        },

        //添加讲师的方法
        saveTeacher(){
            teacherApi.addTeacher(this.teacher)
                .then(response =>{//添加成功
                    //1.提示成功
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    //teacher即为方法接口返回值的名字：return R.ok().data("teacher",teacher);
                    //直接把值给teacher就行，因为它已经被双向绑定
                    this.teacher = response.data.teacher

                    //2.回到列表页面 路由跳转 重定向redirect
                    this.$router.push({path:'/teacher/table'})
                })
        },

        //修改讲师的方法
        updateTeacher(){
            teacherApi.updateTeacherInfo(this.teacher)
            .then(response =>{
                //1.提示成功
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                
                //2.回到列表页面 路由跳转 重定向redirect
                this.$router.push({path:'/teacher/table'})
            })
        },


        // 上传成功后的回调函数
        cropSuccess(data) {
          console.log(data)
          this.imagecropperShow = false
          this.teacher.avatar = data.url
          // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
         },

        // 关闭上传组件
        close() { 
          this.imagecropperShow = false
          // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
          this.imagecropperKey = this.imagecropperKey + 1
         }



    }

}
</script>
