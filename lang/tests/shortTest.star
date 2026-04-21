define (, ), formula, implies;
wp = fix p: formula;
wq = fix q: formula;
wr = fix r: formula;
ws = fix s: formula;
w2 = axiom ( p implies q ):formula;
wnew = ( s implies ( r implies p ) ):formula;

proof of wnew {
    ws;
    wr;
    wp;
    w2;
    w2;
}
