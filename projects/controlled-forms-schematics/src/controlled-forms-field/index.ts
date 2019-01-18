import {strings, join} from '@angular-devkit/core';
import {WorkspaceProject} from '@angular-devkit/core/src/workspace';
import {Rule, SchematicContext, SchematicsException, Tree, apply, branchAndMerge, mergeWith, template, url, chain, move} from '@angular-devkit/schematics';
import {getWorkspace} from '@angular/cli/utilities/config';
import {buildRelativePath, addDeclarationToModule, InsertChange, addExportToModule} from '@ngrx/schematics/schematics-core';
import {findModuleFromOptions} from '@schematics/angular/utility/find-module';
import * as ts from 'typescript';
import {Schema as FieldOptions} from './schema';

function readIntoSourceFile(host: Tree, modulePath: string) {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');
  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addDeclarationToNgModule(options: FieldOptions): Rule {
  return (host: Tree) => {
    if (options.skipImport || !options.module) {
      return host;
    }
    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath) as any;
    const componentPath = `/${options.path}/`
        + (options.flat ? '' : strings.dasherize(options.name) + '/')
        + strings.dasherize(options.name)
        + '.component';
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`${options.name}Component`);
    const declarationChanges = addDeclarationToModule(source, modulePath, classifiedName, relativePath);
    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);
    if (options.export) {
      // Need to refresh the AST because we overwrote the file in the host.
      const aSource = readIntoSourceFile(host, modulePath) as any;
      const exportRecorder = host.beginUpdate(modulePath);
      const exportChanges = addExportToModule(aSource, modulePath, strings.classify(`${options.name}Component`), relativePath);
      for (const change of exportChanges) {
        if (change instanceof InsertChange) {
          exportRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(exportRecorder);
    }

    return host;
  };
}


function getProject(): WorkspaceProject | null {
  let project = null;
  const workspace = getWorkspace();
  if (workspace) {
    const projectName = workspace.getDefaultProjectName();
    project = workspace.getProject(<string>projectName);
  }
  return project;
}

function findModule(host: Tree, generateDir: string) {
  let dir = host.getDir('/' + generateDir);
  const moduleRe = /\.module\.ts$/;
  const routingModuleRe = /-routing\.module\.ts/;
  while (dir) {
    const matches = dir.subfiles.filter(p => moduleRe.test(p) && !routingModuleRe.test(p));
    if (matches.length === 1) {
      return join(dir.path, matches[0]);
    }
    else if (matches.length > 1) {
      throw new Error('More than one module matches. Use skip-import option to skip importing '
          + 'the component into the closest module.');
    }
    dir = <any>dir.parent;
  }
  throw new Error('Could not find an NgModule. Use the skip-import '
      + 'option to skip importing in NgModule.');
}

export default function (options: FieldOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }


    const project = getProject();
    if (project) {
      options.path = options.path  || project.root + '/src/app';
      options.prefix = options.prefix || project.prefix;
    }
    options.styleext = options.styleext || 'scss';
    options.module = options.module || findModule(host, options.path as string);
    options.changeDetection = options.changeDetection || 'Default' as any;


    const templateSource = apply(
        url('./files'),
        [
          template({
            ...strings,
            ...options,
          }),
          move('/', options.path)
        ]
    );
    // const tree$ = templateSource(context) as Observable<Tree>;
    // tree$.subscribe(tree => {
    //   console.log('aaaaa', tree.root.path);
    //   console.log(tree.exists(tree.root.path));
    // })

    return chain([
      branchAndMerge(mergeWith(templateSource)),
      addDeclarationToNgModule(options),
    ])(host, context);
  };
}
