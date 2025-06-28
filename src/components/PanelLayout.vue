<template>
		<div class="container-fluid" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">	
			<div class="big-content">
				<aside class="relative">
					<div class="sidebar overflow-auto" :class="{'closed':!sidebar_full, 'phone': phone_show}">sidebar
						<a href="javascript:;" @click="sidebar_full = !sidebar_full">
							<span v-if="sidebar_full">Close</span>
							<span v-if="!sidebar_full">Open</span>
						</a>

						<br>
						<br>
						<br>
						
						<a href="javascript:;" class="md:hidden" @click="phone_show = !phone_show">Phone Launcher</a>
						<p v-for="(i, z) in 500" :key="i">sidebar menu</p>
					
					</div>
				</aside>
				<main class="main-content" :class="{'md:ml-[var(--sidebar-close-width)]':!sidebar_full, 'md:ml-[var(--sidebar-open-width)]':sidebar_full}">
					<div class="topbar">
						<a href="javascript:;" class="md:hidden" @click="phone_show = !phone_show">Phone Launcher</a>
						123
					</div>
					<section>
						this is content section
						<p v-for="(i, z) in 500" :key="i">test aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
					</section>
				</main>
			</div>
		</div>
</template>
<script>


export default {

	name: 'PanelLayout',
	components: {

	},
	data : function(){
		return {
			sidebar_full : true,
			phone_show: false,
			touchStartX: 0,
			touchStartY: 0,
			minSwipeDistance: 30
		}
	},
	methods:{
		handleTouchStart: function(e) {
			this.touchStartX = e.touches[0].clientX;
			this.touchStartY = e.touches[0].clientY;
		},

		handleTouchEnd: function(e){
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			
			const deltaX = touchEndX - this.touchStartX;
			const deltaY = Math.abs(touchEndY - this.touchStartY);
			
			if (deltaY < 100) {
				
				if (deltaX > this.minSwipeDistance && this.touchStartX < 50) {
					this.phone_show = true;
				}else if (deltaX < -this.minSwipeDistance && this.phone_show) {
					this.phone_show = false;
				}
			}
		},
		handleTouchMove: function(e) {
			if (this.touchStartX < 50) {
				e.preventDefault();
			}
		},

		handleOutsideClick: function(e) {
			if (this.phone_show && window.innerWidth < 768) {
				const sidebar = this.$el.querySelector('.sidebar.phone');
				const launcher = e.target.closest('a[href="javascript:;"]');
				
				if (sidebar && !sidebar.contains(e.target) && !launcher) {
					this.phone_show = false;
				}
			}
		}
		
	},
	watch:{

	},
	updated(){

	
	},
	mounted(){
		document.addEventListener('click', this.handleOutsideClick);
	},
	beforeUnmount() {
		document.removeEventListener('click', this.handleOutsideClick);
	}

}


</script>