const chalk = require('chalk')
const path = require('path')
const Promise = require('bluebird')
const fs = require('fs')
const mkdirp = require('mkdirp')
const { 
	existsSync,
	readdirSync,
	statSync,
	readFileSync,
	writeFileSync,
	mkdirSync
} = require('fs')

// const statAsync = Promise.promisify(fs.stat)
// const readdirAsync = Promise.promisify(fs.readdir)
// const readFileAsync = Promise.promisify(fs.readFile)
// const writeFileAsync = Promise.promisify(fs.writeFile)
// const mkdirpAsync = Promise.promisify(mkdirp)


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

	copyAssets(compilation, outputPath) {
		const inputPath = path.join(process.cwd(), this.dir)

		const write = file => {
			let data = readFileSync(file),
				name = this.getFlattenedFileName(file)
			
			writeFileSync(path.resolve(outputPath, name), data)
			compilation.assets[name] = {
				source: () => data,
				size: () => data.length
			}
		}
		
		const walk = directory => {
			let contents = readdirSync(directory)
			contents.forEach(e => {
				let file = path.resolve(directory, e),
					stat = statSync(file)
				
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