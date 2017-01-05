from __future__ import print_function
import sys
import os
import json

import logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)



def combine_files(infiles, outfile, separator="\n"):

    with open(outfile + 'out', 'w') as ofile:
        for fname in infiles:
            try:
                log.info("processing {}".format(fname))
                with open(fname) as infile:
                    for line in infile:
                        ofile.write(line)
                ofile.write(separator)
            except Exception  as ex:
                log.info(ex)
                #sys.stderr.write('problem reading {}\n'.format(fname))
    log.info("created {}".format(outfile))


def main():

    grunt = json.load(open("Gruntfile.json",'r'))
    sep = grunt.get("concat",{}).get("options",{}).get("separator","")

    for task_name, task_data in grunt.get('concat').items():
        if task_name == "options":
            pass
        else:
            outfile = task_data['dest']
            infiles = task_data['src']
            combine_files(infiles, outfile, separator=sep)






if __name__ == '__main__':
    main()


