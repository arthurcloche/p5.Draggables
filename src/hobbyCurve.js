//hobby curve by @arnoson
//https://github.com/arnoson/hobby-curve
const t = function (t, e, l) {
    const a = 1 / e,
      n = 1 / l;
    return Math.min(
      4,
      ((3 - a) * a ** 2 * t + n ** 3) / (a ** 3 * t + (3 - n) * n ** 2)
    );
  },
  e = (t, e, l, a, n) =>
    Math.min(
      4,
      (2 + Math.sqrt(2) * (t - l / 16) * (l - t / 16) * (e - a)) /
        (1.5 * n * (2 + (Math.sqrt(5) - 1) * e + (3 - Math.sqrt(5)) * a))
    ),
  l = (t, l) => {
    const a = Math.sin(t.theta),
      n = Math.cos(t.theta),
      h = Math.sin(l.phi),
      r = Math.cos(l.phi),
      o = l.leftY,
      s = t.rightY,
      i = e(a, n, h, r, o),
      Y = e(h, r, a, n, s);
    (t.rightX = t.x + (t.deltaX * n - t.deltaY * a) * i),
      (t.rightY = t.y + (t.deltaY * n + t.deltaX * a) * i),
      (l.leftX = l.x - (t.deltaX * r + t.deltaY * h) * Y),
      (l.leftY = l.y - (t.deltaY * r - t.deltaX * h) * Y);
  },
  a = (e, a = 1, n = !1) => {
    var h, r;
    const o = e.map(({ x: t, y: e }) =>
        ((t, e, l) => ({
          x: t,
          y: e,
          leftY: l,
          rightY: l,
          leftX: l,
          rightX: l,
          deltaX: 0,
          deltaY: 0,
          delta: 0,
          theta: 0,
          phi: 0,
          psi: 0,
        }))(t, e, a)
      ),
      s = o[0],
      i = o[o.length - 1];
    for (let t = 0; t < o.length; t++)
      (o[t].next = null != (h = o[t + 1]) ? h : s),
        (o[t].prev = null != (r = o[t - 1]) ? r : i);
    if (
      (((t, e) => {
        var l;
        const a = e ? t.length : t.length - 1;
        for (let e = 0; e < a; e++) {
          const a = t[e],
            n = null != (l = t[e + 1]) ? l : t[0];
          (a.deltaX = n.x - a.x),
            (a.deltaY = n.y - a.y),
            (a.delta = Math.hypot(a.deltaX, a.deltaY));
        }
      })(o, n),
      2 === e.length && !n)
    )
      return (
        ((t, e) => {
          let l = 1 / (3 * t.rightY);
          (t.rightX = t.x + t.deltaX * l),
            (t.rightY = t.y + t.deltaY * l),
            (l = 1 / (3 * e.leftY)),
            (e.leftX = e.x - t.deltaX * l),
            (e.leftY = e.y - t.deltaY * l);
        })(s, i),
        o
      );
    ((t, e) => {
      const [l, a] = e ? [0, t.length] : [1, t.length - 1];
      for (let e = l; e < a; e++) {
        const l = t[e],
          a = l.prev,
          n = a.deltaY / a.delta,
          h = a.deltaX / a.delta;
        l.psi = Math.atan2(
          l.deltaY * h - l.deltaX * n,
          l.deltaX * h + l.deltaY * n
        );
      }
    })(o, n),
      (function (e, l) {
        var a;
        const n = [],
          h = [],
          r = [],
          o = e[0],
          s = e[1],
          i = e[e.length - 1],
          Y = l ? e.length + 1 : e.length;
        if (l) (n[0] = 0), (r[0] = 0), (h[0] = 1);
        else {
          const e = o.next,
            l = o.rightX,
            a = Math.abs(e.leftY),
            i = Math.abs(o.rightY);
          (n[0] = t(l, i, a)), (r[0] = -s.psi * n[0]), (h[0] = 0);
        }
        for (let s = 1; s < Y; s++) {
          const c = null != (a = e[s]) ? a : o,
            d = c.next,
            f = c.prev,
            g = s === Y - 1;
          if (!l && g) {
            const e = c.leftX,
              l = Math.abs(c.leftY),
              a = Math.abs(f.rightY),
              h = t(e, l, a);
            i.theta = (-r[Y - 2] * h) / (1 - h * n[Y - 2]);
            break;
          }
          {
            let t = 1 / (3 * Math.abs(f.rightY) - 1),
              e = c.delta * (3 - 1 / Math.abs(f.rightY)),
              a = 1 / (3 * Math.abs(d.leftY) - 1),
              i = f.delta * (3 - 1 / Math.abs(d.leftY));
            const x = 1 - n[s - 1] * t;
            e *= x;
            const M = Math.abs(c.leftY),
              X = Math.abs(c.rightY);
            M < X ? (e *= (M / X) ** 2) : (i *= (X / M) ** 2);
            let p = i / (i + e);
            n[s] = p * a;
            let y = -d.psi * n[s];
            if (
              ((p = (1 - p) / x),
              (y -= c.psi * p),
              (p *= t),
              (r[s] = y - r[s - 1] * p),
              (h[s] = -h[s - 1] * p),
              l && g)
            ) {
              let t = 0,
                e = 1;
              for (let l = s - 1; l >= 0; l--) {
                const a = 0 === l ? Y - 1 : l;
                (t = r[a] - t * n[a]), (e = h[a] - e * n[a]);
              }
              (t /= 1 - e), (o.theta = t), (r[0] = t);
              for (let e = 1; e < Y - 1; e++) r[e] = r[e] + t * h[e];
              break;
            }
          }
        }
        for (let t = Y - 2; t >= 0; t -= 1)
          e[t].theta = r[t] - e[t].next.theta * n[t];
      })(o, n),
      ((t, e) => {
        for (let e = 0; e < t.length; e++) {
          const l = t[e];
          l.phi = -l.psi - l.theta;
        }
      })(o);
    const Y = n ? o.length : o.length - 1;
    for (let t = 0; t < Y; t++) l(o[t], o[t].next);
    return o;
  },
  n = (t, { tension: e = 1, cyclic: l = !1 } = {}) => {
    const n = a(t, e, l),
      h = [],
      r = l ? n.length : n.length - 1;
    for (let t = 0; t < r; t++) {
      const e = n[t];
      h.push({
        startControl: { x: e.rightX, y: e.rightY },
        endControl: { x: e.next.leftX, y: e.next.leftY },
        point: { x: e.next.x, y: e.next.y },
      });
    }
    return h;
  },
  h = (t, { tension: e = 1, cyclic: l = !1 } = {}) => {
    const a = n(t, { tension: e, cyclic: l }),
      h = (t) => [t.x, t.y].join(","),
      r = a.map(({ startControl: t, endControl: e, point: l }) =>
        [h(t), h(e), h(l)].join(" ")
      );
    return `M ${t[0].x},${t[0].y} C ${r}`;
  };
const createHobbyBezier = n;
const createHobbyCurve = h;
