#!/usr/bin/env node

import { promisify } from 'util'
import { writeFile } from 'fs'
import { resolve, dirname } from 'path'
import yargs from 'yargs'
import fg from 'fast-glob'
import mkdirp from 'mkdirp'
import { snapshot } from './'

const writeFileAsync = promisify(writeFile)
const mkdirpAsync = promisify(mkdirp)

const createSums = async ({ filepath, algorithm, files }) => {
  const filepaths = await fg(files)

  // The glob doesn't match anyfile so there's nothing to do
  if (!files.length) { return }

  const generatedSnapshot = await snapshot(filepaths, { algorithm })

  // Create possible nested directories
  await mkdirpAsync(dirname(resolve(process.cwd(), filepath)))

  return writeFileAsync(
    resolve(process.cwd(), filepath),
    JSON.stringify(generatedSnapshot, null, 2)
  )
}

// Define cli options
export default yargs
  .command(
    'snapshot [filepath] [files...]',
    'Create a JSON file with the sums of the given files',
    yargs => {
      yargs
        .positional('filepath', {
          describe: 'Filepath to store the sums',
          default: 'sums.json'
        })
    },
    createSums
  )
  .option('algorithm', {
    alias: 'a',
    default: 'sha256',
    describe: 'Set the checksum algorithm'
  })
  .argv
