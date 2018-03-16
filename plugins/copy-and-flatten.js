const chalk = require('chalk')
const path = require('path')
const Promise = require('bluebird')
const fs = require('fs')
const mkdirp = require('mkdirp')

const { existsSync } = fs
const statAsync = Promise.promisify(fs.stat)
const readdirAsync = Promise.promisify(fs.readdir)
const readFileAsync = Promise.promisify(fs.readFile)
const writeFileAsync = Promise.promisify(fs.writeFile)
const mkdirpAsync = Promise.promisify(mkdirp)

class CopyAndFlattenPlugin {

	constructor({dir, skip = [], optimize}) {
		this.dir = dir
		this.skip = ['.DS_Store'].concat(skip)
		this.optimize = optimize
	}
	
	apply(compiler) {
		compiler.hooks.compilation.tap(this.constructor.name, compilation => {
			if(!existsSync(compiler.outputPath)) mkdirSync(compiler.outputPath)
		})
		compiler.hooks.emit.tap(this.constructor.name, compilation => {
			this.copyAssets(compilation, compiler.outputPath) 
		})

	}

	async copyAssets(compilation, outputPath) {
		return new Promise((resolve, reject) => {

		})
		const inputPath = path.join(process.cwd(), this.dir)
		
		const write = async file => {
			
			let data = await readFileAsync(file)
			let	name = this.getFlattenedFileName(file)
			
			await writeFileAsync(path.resolve(outputPath, name), data)

			compilation.assets[name] = {
				source: () => data,
				size: () => data.length
			}

		}
		
		const walk = async directory => {
			let contents = await readdirAsync(directory)

			contents.forEach(async e => {

				let file = path.resolve(directory, e)
				let	stat = await statAsync(file)
				
				if(stat && stat.isDirectory()) walk(file)
				else if (this.shouldCopyFile(file)) write(file)

			})

		}

		try { walk(inputPath) } 
		catch (err) { throw new Error(err) }
	}



	getFlattenedFileName(file) {
		return file.split(this.dir)[1].split('/').join('_').substr(1)
	}

	shouldCopyFile(file) {
		for(let i = 0; i < this.skip.length; i++) {
			if(RegExp(this.skip[i]).test(file)) return false
		}
		return true
	}

}

module.exports = CopyAndFlattenPlugin