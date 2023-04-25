<template>
    <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="名称">
                            <el-input v-model="searchForm.name" placeholder="名称"></el-input>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="searchForm.address" placeholder="地址"></el-input>
                        </el-form-item>
                        <el-form-item label="面积">
                            <el-input v-model="searchForm.size" placeholder="面积"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row>
                        <el-button type="danger" plain @click="deleteByIds" style="float: left;">批量删除</el-button>
                        <el-button type="primary" plain @click="dialogVisible = true" style="float: left;">新增</el-button>
                    </el-row>

                    <el-dialog title="新增门店" :visible.sync="dialogVisible" width="30%">
                        <el-form ref="form" :model="shopadd" label-width="100px">
                            <el-form-item label="门店名称">
                                <el-input v-model="shopadd.name"></el-input>
                            </el-form-item>
                            <el-form-item label="地址">
                                <el-input v-model="shopadd.address"></el-input>
                            </el-form-item>
                            <el-form-item label="面积">
                                <el-input v-model="shopadd.size" placeholder="（平方米）"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addshop">确定</el-button>
                                <el-button @click="dialogVisible = false">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>

                    <el-table :data="tableData" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column prop="name" label="门店名称" width="180"></el-table-column>
                        <el-table-column prop="address" label="地点" width="180"></el-table-column>
                        <el-table-column prop="size" label="面积（平方米）" width="180">
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="editStore(scope.row.id)">编辑</el-button>
                                <el-button type="danger" size="small" @click="deleteStore(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <el-dialog title="修改门店信息" :visible.sync="dialogVisible1" width="30%">
                        <el-form ref="form" :model="shopupdate" label-width="100px">
                            <el-form-item label="门店名称">
                                <el-input v-model="shopupdate.name"></el-input>
                            </el-form-item>
                            <el-form-item label="地址">
                                <el-input v-model="shopupdate.address"></el-input>
                            </el-form-item>
                            <el-form-item label="面积">
                                <el-input v-model="shopupdate.size" placeholder="（平方米）"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updateshop">确定</el-button>
                                <el-button @click="dialogVisible1 = false">返回</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>

                    <!-- 分页条 -->
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                    </el-pagination>  
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'VueShop',
    data() {
        return {
            totalCount: 1000,
            // 当前页码
            currentPage: 1,
            pageSize: 5,
            tableData: [
                {
                    name: '1',
                    address: '北京市',
                    size: '600',
                    id: ''
                },
            ],
            dialogVisible: false,
            dialogVisible1: false,
            searchForm: {
                name: "",
                address: "",
                size: ""
            },
            shopadd: {
                name: "",
                address: "",
                size: ""
            },
            shop: {
                name: "",
                address: "",
                size: ""
            },
            shopupdate: {
                name: "",
                address: "",
                size: ""
            }
        }
    },
    mounted() {
        this.onSubmit();
    },
    methods: {
        onSubmit() {
            const params = {
                name: this.searchForm.name || null,
                address: this.searchForm.address || null,
                size: this.searchForm.size || null,
                pageSize: this.pageSize, // 每页显示条数
                page: this.currentPage // 当前页码
            };
            axios.get('http://localhost:8080/store/select', { params })
                .then(response => {
                    // 处理查询结果
                    console.log(response.data);
                    this.tableData = response.data.rows;
                    this.totalCount = response.data.total;
                })
                .catch(error => {
                    // 处理错误
                    console.error(error);
                });
        },
        logout() {
            this.$router.push({ path: "/login" });
        },
        deleteStore(id) {
            console.log(id);
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete(`http://localhost:8080/store/${id}`)
                    .then(response => {
                        // 删除成功后的处理逻辑
                        console.log(response);
                        this.$message.success('门店删除成功');
                        this.onSubmit();
                        // 在此处执行其他逻辑，例如重新加载员工列表等
                    })
                    .catch(error => {
                        // 删除失败后的处理逻辑
                        this.$message.error('门店删除失败');
                        console.error(error);
                    });
            }).catch(() => {
                // 取消删除时的处理逻辑
                this.$message.info('已取消删除');
            });
        },
        editStore(row) {
            console.log(row);
            // 根据id从后端查询门店信息
            axios.get(`http://localhost:8080/store/select/${row}`)
                .then(response => {
                    console.log(response.data);
                    // 将查询到的员工信息回显到编辑表单中
                    this.shopupdate = response.data;
                    this.dialogVisible1 = true; // 打开编辑对话框
                })
                .catch(error => {
                    console.error(error);
                });
        },
        addshop() {
            const params = {
                name: this.shopadd.name,
                address: this.shopadd.address,
                size: this.shopadd.size,
            };

            // 发送添加门店请求
            axios.post('http://localhost:8080/store/add', params)
                .then(response => {
                    // 处理添加门店成功的逻辑
                    console.log('添加门店成功', response);
                    // 关闭对话框
                    this.$message({
                        message: '恭喜你，添加成功',
                        type: 'success'
                    });

                    this.dialogVisible = false;
                    // 清空表单数据
                    this.shopadd = {};
                    // 刷新员工列表等操作
                    // ...
                    this.onSubmit();
                })
                .catch(error => {
                    // 处理添加门店失败的逻辑
                    console.error('添加门店失败', error);
                    // 显示错误提示等操作
                    this.onSubmit();
                    // ...
                });
        },

        deleteByIds() {
            const ids = this.multipleSelection.map(item => item.id);
            console.log(ids);
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete(`http://localhost:8080/store/${ids.join(',')}`)
                    .then(response => {
                        // 处理删除成功的逻辑
                        console.log('删除成功', response.data);
                        this.$message({
                            message: '恭喜你，删除成功',
                            type: 'success'
                        });
                        this.onSubmit();
                    })
                    .catch(error => {
                        // 处理删除失败的逻辑
                        console.error('删除失败', error);
                    });
            }).catch(() => {
                this.$message.info('已取消删除');
            })
        },
        updateshop() {
            const requestBody = {
                // 根据后端接口的定义，传递需要更新的门店信息
                name: this.shopupdate.name,
                address: this.shopupdate.address,
                size: this.shopupdate.size,
            };
            axios.put(`http://localhost:8080/store/update/` + this.shopupdate.id, requestBody)
                .then(response => {
                    console.log(response); // 打印响应信息
                    this.dialogVisible1 = false; // 关闭编辑对话框
                    // 刷新表格数据等操作
                    this.onSubmit();
                    this.$message.success('门店信息更新成功！');
                })
                .catch(error => {
                    console.error(error); // 打印错误信息
                    this.$message.error('门店信息更新失败，请重试！');
                });
        },
        handleSizeChange(size) {
            // 处理每页显示条数变更事件
            this.pageSize = size;

            // 这里可以重新调用查询接口获取当前页数据
            // ...
            this.onSubmit();
        },
        handleCurrentChange(currentPage) {
            // 处理页码变更事件
            this.currentPage = currentPage;

            // 这里可以重新调用查询接口获取当前页数据
            // ...
            this.onSubmit();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
};
</script>

<style lang="scss" scoped>

</style>