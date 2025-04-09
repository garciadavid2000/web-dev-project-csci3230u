<template>
  <div class="about">
    <div class="content">
      <h1>Group Members</h1>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Banner ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.bannerId">
            <td>{{ student.firstName }} {{ student.lastName }}</td>
            <td>{{ student.bannerId }}</td>
          </tr>
        </tbody>
      </table>

      <div class="svg-container">
        <svg width="55" height="80" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="#007BFF">
          <g transform="matrix(1 0 0 -1 0 80)">
            <rect width="10" height="20" rx="3">
              <animate attributeName="height" begin="0s" dur="4.3s"
                values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20"
                calcMode="linear" repeatCount="indefinite" />
            </rect>
            <rect x="15" width="10" height="80" rx="3">
              <animate attributeName="height" begin="0s" dur="2s"
                values="80;55;33;5;75;23;73;33;12;14;60;80"
                calcMode="linear" repeatCount="indefinite" />
            </rect>
            <rect x="30" width="10" height="50" rx="3">
              <animate attributeName="height" begin="0s" dur="1.4s"
                values="50;34;78;23;56;23;34;76;80;54;21;50"
                calcMode="linear" repeatCount="indefinite" />
            </rect>
            <rect x="45" width="10" height="30" rx="3">
              <animate attributeName="height" begin="0s" dur="2s"
                values="30;45;13;80;56;72;45;76;34;23;67;30"
                calcMode="linear" repeatCount="indefinite" />
            </rect>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      students: [
        { firstName: "Adam", lastName: "Orfao", bannerId: "100821735" },
        { firstName: "Daniel", lastName: "Zajac ", bannerId: "100820183" },
        { firstName: "David", lastName: "Garcia", bannerId: "100820537" },
        { firstName: "David", lastName: "Houle-Tymeczko", bannerId: "100816849" },
        { firstName: "Heisn", lastName: "Nithysingha ", bannerId: "100817036" },
        { firstName: "Sheida", lastName: "Ebrahimi Siaghi", bannerId: "100840009" },
      ],
    };
  },
};
</script>

<style scoped>
.about {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
}

table {
  margin: 1rem auto;
  border-collapse: collapse;
  width: 100%;
}

.svg-container {
  margin-top: 2rem;
}
</style>
