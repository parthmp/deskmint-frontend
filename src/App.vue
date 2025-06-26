<template>
  <div>
    <ul>
      <li><router-link to="/hello">Hello World</router-link></li>
      <li><router-link to="/">Test 1</router-link></li>
      <li><router-link to="/test2">Test 2</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>
