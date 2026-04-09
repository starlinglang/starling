// longTest.star
let longTest = `
  define 0, +, equals, implies, <, >, term, formula, provable;
  tt = fix t: term;
  tr = fix r: term;
  ts = fix s: term;
  wp = fix P: formula;
  wq = fix Q: formula;

  tze = axiom 0: term;
  tpl = axiom <t + r>: term;
  weq = axiom t equals r: formula;
  wim = axiom <P implies Q>: formula;


  a1 =  axiom <t equals r implies <t equals s implies r equals s >>: provable;
  a2 =  axiom <t+0> equals t: provable;

  block {
      min = assume P: provable;
      maj = assume <P implies Q>: provable;
      mp = axiom Q: provable;
      // comment inside block
  }

  th1 = t equals t: provable;

  proof of th1 {
	tt;
	tze;
	tpl;
	tt;
	weq;
	tt;
	tt;
	weq;
	tt;
	a2;
	tt;
	tze;
	tpl;
	tt;
	weq;
	tt;
	tze;
	tpl;
	tt;
	weq;
	tt;
	tt;
	weq;
	wim;
	tt;
	a2;
	tt;
	tze;
	tpl;
	tt;
	tt;
	a1;
	mp;
	mp;
  }
`;

//shortTest.star
let shortTest = `
  define < ,>, implies, formula;
  wp = fix p: formula;
  wq = fix q: formula;
  wr = fix r: formula;
  ws = fix s: formula;
  w2 = axiom <p implies q>: formula;
  wnew = <s implies < r implies p >> :formula;

  proof of wnew {
    ws;
    wr;
    wp;
    w2;
    w2;
  }
  `;

module.exports = { shortTest, longTest };
