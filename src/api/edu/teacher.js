import request from '@/utils/request'


export default{
    
    //1 讲师列表（条件分页查询）
    //current 当前页 limit 每页记录数 teacherQuery条件对象
    getTeacherListPage(current,limit,teacherQuery){
         return request({
        //通过地址拼接参数的方式进行传值
        //url: '/table/list'+current+"/"+limit,
        url:`/edu/teacher/pageTeacherCondition/${current}/${limit}`,
        method: 'post',
        //teacherQuery条件对象,后端使用RequestBody获取数据,需要用Json传递
        //data表示把teacherQuery对象转换成Json进行传递到接口里面
        data: teacherQuery
      })
    },
    //删除讲师
    deleteTeeacherById(id){
      return request({

        url:`/edu/teacher/${id}`,
        method: 'delete'

      })

    },

    addTeacher(teacher){
      
      return request({
        url:`/edu/teacher/addTeacher`,
        method: 'post',
        data: teacher

      })
    },
    //定义id查询讲师接口
    getTeacherInfo(id){
      
      return request({
        url:`/edu/teacher/getTeacher/${id}`,
        method: 'get',
      })
    },
    //修改讲师
    updateTeacherInfo(teacher){
      return request({
        url:`/edu/teacher/upDateTeacher`,
        method: 'post',
        data: teacher
      })
    }


    
   

}
