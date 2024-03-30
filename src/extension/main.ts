import type { LanguageClientOptions, ServerOptions} from 'vscode-languageclient/node.js';
import * as vscode from 'vscode';
import * as path from 'node:path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';
import { GenerateOptions, generateAction } from '../cli/main.js';

let client: LanguageClient;
let outputChannel: vscode.OutputChannel

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel("R2D2", 'r-2-d-2')
    
    registerGenerateCommands(context)

    client = startLanguageClient(context);
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
    if (client) {
        return client.stop();
    }
    return undefined;
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join('out', 'language', 'main.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'r-2-d-2' }]
    };

    // Create the language client and start the client.
    const client = new LanguageClient(
        'r-2-d-2',
        'r2d2',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start();
    return client;
}

function registerGenerateCommands(context: vscode.ExtensionContext) : void {
    const build_generate_functions = (opts: GenerateOptions) => {
        return () => {
            const filepath = vscode.window.activeTextEditor?.document.fileName
            if(filepath) {
                outputChannel.appendLine(`Code Generated Successfully`)
                generateAction(filepath, opts).catch(
                    (reason) => vscode.window.showErrorMessage(reason.message)
                )
            }
        }
    }

    const generateBack = build_generate_functions({ only_back: true })
    context.subscriptions.push(vscode.commands.registerCommand("r-2-d-2.generateBack", generateBack))

    const generateFront = build_generate_functions({ only_front: true })
    context.subscriptions.push(vscode.commands.registerCommand("r-2-d-2.generateFront", generateFront))

    const generateBoth = build_generate_functions({ all: true })
    context.subscriptions.push(vscode.commands.registerCommand("r-2-d-2.generateBoth", generateBoth))
    
    const generateDocumentation = build_generate_functions({ only_Documentation: true })
    context.subscriptions.push(vscode.commands.registerCommand("r-2-d-2.generateBoth", generateDocumentation))

    const generateBacklog = build_generate_functions({ only_Backlog: true })
    context.subscriptions.push(vscode.commands.registerCommand("r-2-d-2.generateBacklog", generateBacklog))

}