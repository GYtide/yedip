import os

def get_files(path):
    num= 0 
    num2 = 0
    for filepath,dirnames,filenames in os.walk(path):
        for filename in filenames:
            suff = filename.split('.')
            if suff[-1] == 'js' or suff[-1] == 'html' or suff[-1] == 'css' or suff[-1] == 'ts':
                num = num + 1
                try:
                    count = len(open(os.path.join(filepath,filename),'r',encoding='utf-8').readlines())
                    # print(open(os.path.join(filepath,filename),'r',encoding='utf-8'))
                    num2 = num2 + count 
                    # print(count)
                except ValueError :
                    print(ValueError)
    print(num2,num)


if __name__ == '__main__':
    # get_files(r'E:/_todo/dip_expe/yedip/src')
    # get_files(r'E:/projects/fromgithub/LenovoLegionToolkit-2.7.1')
    get_files(r'E:/projects/fromgithub/LenovoLegionToolkit-2.7.1')
    



