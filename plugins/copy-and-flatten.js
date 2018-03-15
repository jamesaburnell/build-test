const chalk = require('chalk')
const pluginUtils = require('./plugin-utils')
const path = require('path')
const fs = require('fs')

class CopyAndFlattenPlugin {

	constructor({dir, type = "flatten"}) {
		this.type = type
		this.dir = dir
	}
	
	apply(compiler) {
        /**
         * @param {CompilerParams} params - params holds the default module factories as well 
         * as compilation dependencies in a single object
         * @param {Function} callback - callback to inform the compiler to continue
         * @description "before-compile" - This purpose of this hook is to perform functionality before the `compiler` hook has executed and is run. 
         * Examples of things that are done within webpack source for this hook include storing files (See DllReferencePlugin:22). 
         * 
         */

		// this.assetPath = path.resolve(__dirname, this.dir)
		console.log('\n\n\n')
		console.log(chalk.green('props: '), this)
		console.log('\n\n\n')
		console.log(chalk.green('asset path: '), path.resolve(__dirname, this.dir))
		// compiler.outputFileSystem.writeFile('readme.md')


        compiler.hooks.beforeCompile.tap('before-compile', (params) => {
            const {normalModuleFactory, contextModuleFactory} = params;
            const foo = "DO SOMETHING AND SET IT UP BEFORE COMPILE STEP";
			params.foo = foo;
			// console.log('params: ', params)
			console.log('\n\n\n')
			console.log(chalk.green('Compiler props in before-compile:'))
			for(let key in compiler){
				console.log(key)
			}
			console.log('\n\n\n')
			console.log(chalk.green('input fileSystem in before compile: '), compiler.inputFileSystem._readFileStorage)
			console.log('\n\n\n')
			console.log(chalk.green('compiler output path in before compile: '), compiler.outputPath)
			console.log('\n\n\n')
            pluginUtils.logPluginEvent(`before-compile ${foo}`, "CompilerWebpackPlugin", "bgGreen", "magenta", "white");
            // pluginUtils.logPluginEvent(`compiler:before-compile:Param Added:Params: -- ${Object.keys(params)}`, "CompilerWebpackPlugin", "bgGreen", "magenta", "white");
        });


        compiler.hooks.afterCompile.tap("after-compile", compilation => {
			console.log('\n\n\n')
			console.log(chalk.yellow('Compiler props in after-compile:'))
			for(let key in compiler){
				console.log(key)
			}
			console.log('\n\n\n')
			console.log(chalk.yellow('compiler output path in after compile: '), compiler.outputPath)
			console.log('\n\n\n')
		});
		

    }
}

module.exports = CopyAndFlattenPlugin