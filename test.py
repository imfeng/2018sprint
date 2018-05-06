# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals

f = open('contract2.txt','r', encoding = 'utf-8')
text = f.read()


from snownlp import normal
from snownlp import seg
from snownlp import SnowNLP
from snownlp.summary import textrank
import sys

if __name__ == '__main__':
    # print(text)
    # s = SnowNLP(text)
    # print(s.summary(limit=4))
    t = normal.zh2hans(text)
    sents = normal.get_sentences(t)
    doc = []
    for sent in sents:
        words = seg.seg(sent)
        words = normal.filter_stop(words)
        doc.append(words)
    rank = textrank.TextRank(doc)
    rank.solve()
    f = open('keyword2.txt', 'w', encoding = 'UTF-8')    # 也可使用指定路徑等方式，如： C:\A.txt
    f.write(" ")
    f.close()
    for index in rank.top_index(17):
        # chcp 65001
        # print(sys.stdin.encoding)
        # print(sents[index].encode(sys.stdin.encoding, "replace").decode(sys.stdin.encoding))
        # print(sents[index].encode("utf8", "replace").decode("cp950", "ignore"))
        f = open('keyword2.txt', 'a', encoding = 'UTF-8')    # 也可使用指定路徑等方式，如： C:\A.txt
        # f.write(sents[index] + "_NL_")
        for key in sents[index].split():
            f.write(key + "_NL_")
        f.close()

    keyword_rank = textrank.KeywordTextRank(doc)
    keyword_rank.solve()
    for w in keyword_rank.top_index(17):
        if w != '︰':
            # print(w.encode(sys.stdin.encoding, "replace").decode(sys.stdin.encoding))
            f = open('keyword.txt', 'a', encoding = 'UTF-8')    # 也可使用指定路徑等方式，如： C:\A.txt
            for key in w.split():
                f.write(key + "_NL_")
            # f.write(w + "_NL_")
            f.close()
            # print(w.encode("utf8").decode("cp950", "ignore"))

    print("Finished")
