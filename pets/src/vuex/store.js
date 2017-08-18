import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	user:{
		userName: '',
		adminId: '',
		orgName: '',
		auth: '',
	}
}

const mutations = {
	isLogin (state, loginData) {
		state.user.userName = loginData.userName;
		state.user.adminId = loginData.adminId;
		state.user.orgName = loginData.orgName;
		state.user.auth = loginData.auth;
	},
	isLogout (state) {
		state.user.userName = '';
		state.user.adminId = '';
		state.user.orgName = '';
		state.user.auth = '';
	}
}

export default new Vuex.Store({
	state,
	mutations
})