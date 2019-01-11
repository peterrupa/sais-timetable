const download = `
  <a download="schedule.png" class="SSSBUTTON_ACTIONLINK" id="download-btn">
    Download Schedule
  </a>
`;

const canvasStyle = {
  position: 'absolute',
  left: '120px',
  top: '-45px',
  'box-shadow': '0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
}

const canvas = `
  <canvas id="timetable" style=${
    Object.entries(canvasStyle).reduce((s, [key, value]) => `${s}${key}:${value}; `, '')
  } />
`;

const toggle = '<a href="#" class="timetable-button SSSBUTTON_ACTIONLINK">Toggle Timetable</a>';

const wrapper = `
  <table id="timetable-wrapper">
    <tr>
      <td width="250"></td>
      <td>${download}</td>
      <td>${toggle}</td>
    </tr>
    ${canvas}
  </table>
`;

export default wrapper;
