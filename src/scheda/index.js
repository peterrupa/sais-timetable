import { DAYS, theme, defaultColors } from './constants';

import Subject from './subject';

class Scheda {
  constructor(config) {
    this.history = [];
    this.canvas = null;
    this.ctx = null;

    // User config
    this.config = {
      id: 'scheda',
      dimensions: { width: 811, height: 391 },
      colors: defaultColors,
      theme
    };

    this.init = this.init.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.download = this.download.bind(this);
    this._repaint = this._repaint.bind(this);
    this._textAlignCenter = this._textAlignCenter.bind(this);
    this._drawLine = this._drawLine.bind(this);
  }

  init(canvas) {
    this.canvas = canvas || document.getElementById(this.config.id);

    if (this.canvas) {
      const { dimensions, theme } = this.config;

      this.canvas.width = dimensions.width;
      this.canvas.height = dimensions.height;

      this.ctx = this.canvas.getContext('2d');
      this.config.cell = {
        height: dimensions.height / 13,
        width: (dimensions.width - theme.timeColumnWidth) / 6
      };

      const ctx = this.ctx;
      const { cell } = this.config;

      // Canvas Background
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Table Header
      ctx.fillStyle = theme.header;
      ctx.fillRect(0, 0, dimensions.width, cell.height);

      // Mini Grid
      ctx.beginPath();
      ctx.strokeStyle = theme.grid.mini;
      for (let y = cell.height; y <= dimensions.height; y += cell.height / 4) {
        this._drawLine({ x: 0, y }, { x: dimensions.width, y });
      }
      ctx.stroke();

      // Time Background
      ctx.fillStyle = theme.time.background;
      ctx.fillRect(0, cell.height, theme.timeColumnWidth, dimensions.height);

      // Horizontal Main Grid
      ctx.beginPath();
      ctx.strokeStyle = theme.grid.horizontal;
      for (let y = cell.height; y <= dimensions.height; y += cell.height) {
        this._drawLine({ x: 0, y }, { x: dimensions.width, y });
      }
      ctx.stroke();

      // Vertical Main Grid
      ctx.beginPath();
      ctx.strokeStyle = theme.grid.vertical;
      for (
        let x = theme.timeColumnWidth;
        x <= dimensions.width;
        x += cell.width
      ) {
        this._drawLine({ x, y: 0 }, { x, y: dimensions.height });
      }
      ctx.stroke();

      // Time Label
      ctx.beginPath();
      ctx.fillStyle = theme.time.color;
      ctx.font = `${theme.time.style} ${theme.time.size}px ${theme.time.font}`;
      for (let time = 7; time < 19; time++) {
        let label = '';

        if (time === 12) {
          label = `${time}-1`;
        } else if (time > 12) {
          label = `${time - 12}-${time - 11}`;
        } else {
          label = `${time}-${time + 1}`;
        }

        ctx.fillText(
          label,
          this._textAlignCenter(theme.timeColumnWidth, label),
          cell.height / 2 +
            theme.time.size / 2 +
            (time - 7) * cell.height +
            cell.height
        );
      }

      // Day Label
      ctx.fillStyle = theme.day.color;
      ctx.font = `${theme.day.style} ${theme.day.size}px ${theme.day.font}`;
      ctx.fillText(
        'Time',
        this._textAlignCenter(theme.timeColumnWidth, 'Time'),
        cell.height / 2 + theme.day.size / 2
      );
      DAYS.forEach((day, i) => {
        ctx.fillText(
          `${day}day`,
          theme.timeColumnWidth +
            this._textAlignCenter(cell.width, `${day}day`) +
            i * cell.width,
          cell.height / 2 + theme.day.size / 2
        );
      });
    } else {
      throw new Error(`Unable to find canvas with id ${this.config.id}`);
    }
  }

  add({ day, time, courseCode, section, room, color }) {
    color =
      color ||
      this.config.colors[this.history.length % this.config.colors.length];
    const course = new Subject(day, time, courseCode, section, room, color);

    this.history.push(course);
    return course.render(this.ctx, this.config.theme, this.config.cell);
  }

  remove(id) {
    this.history = this.history.filter(course => course.id !== id);
    this._repaint();
  }

  get(id) {
    return this.history.filter(course => course.id === id)[0];
  }

  update(id, course) {
    const index = this.history.findIndex(course => course.id === id);

    this.history[index] = Object.assign(this.history[index], course);
    this._repaint();
    return this.history[index];
  }

  download(filename) {
    const a = document.createElement('a');

    a.setAttribute('download', filename || 'schedule');
    a.type = 'image/png';
    a.target = '_blank';
    a.href = this.canvas.toDataURL();
    a.onclick = function() {
      this.parentNode.removeChild(this);
    };

    document.querySelector('body').appendChild(a);
    a.click();
  }

  _repaint() {
    this.init();
    this.history.forEach(course => {
      course.render(this.ctx, this.config.theme, this.config.cell);
    });
  }

  _textAlignCenter(width, text) {
    return (width - this.ctx.measureText(text).width) / 2;
  }

  _drawLine(start, end) {
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
  }
}

export default Scheda;
