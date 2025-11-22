import MagicString from 'magic-string';
import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';
import { resolve, dirname } from 'path';
import type { ImagePluginOptions } from '../types/index.ts';

export function transformMarkup( 
  content: string,
  filename: string,
  options: ImagePluginOptions
) {
  // console.log('[Preprocessor] Processing:', filename);
  const s = new MagicString(content);
  // @ts-ignore
  const ast = parse(content);

  // Track imports we need to add
  const imports: Array<{ id: string; path: string; query: string }> = [];
  let importCounter = 0;

  // Find all image component instances
  const componentNames = ['Picture', 'Image', 'BackgroundImage'];

  // @ts-ignore
  walk(ast.html, {
    enter(node: any) {
      if (node.type === 'InlineComponent' && componentNames.includes(node.name)) {
        // console.log('[Preprocessor] Found component:', node.name);
        // Find the src attribute
        const srcAttr = node.attributes?.find(
          (attr: any) => attr.name === 'src' && attr.type === 'Attribute'
        );

        if (srcAttr && srcAttr.value?.length === 1 && srcAttr.value[0].type === 'Text') {
          const imagePath = srcAttr.value[0].data;
          // console.log('[Preprocessor] Found src:', imagePath);

          if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
            const importPath = imagePath.startsWith('.') ? imagePath : './' + imagePath;
            const query = buildQueryString(node, options);
            const importId = `__img_${importCounter++}`;
            imports.push({ id: importId, path: importPath, query });

            const attrStart = content.indexOf('src=', srcAttr.start) + 4;
            const quoteChar = content[attrStart];
            const valueStart = attrStart + 1;
            const valueEnd = content.indexOf(quoteChar, valueStart);

            s.overwrite(attrStart, valueEnd + 1, `{${importId}}`);
            console.log(`[Preprocessor] Replaced src "${imagePath}" with ${importId}`);
          }
        }
        
        // CRITICAL TODO: Handle `artDirectives` prop for <Picture> components.
        const artDirectivesAttr = node.attributes?.find(
            (attr: any) => attr.name === 'artDirectives'
        );
        if (artDirectivesAttr && artDirectivesAttr.value?.length === 1 && artDirectivesAttr.value[0].type === 'MustacheTag') {
            const expression = artDirectivesAttr.value[0].expression;
            console.log('[Preprocessor] Entering artDirectives expression:', expression.type);
            
            walk(expression, {
                enter(exprNode: any) {
                    // Look for properties: src: "path/to/image.jpg"
                    if (exprNode.type === 'Property' && 
                        exprNode.key.name === 'src' && 
                        exprNode.value.type === 'Literal') {
                        
                        const imagePath = exprNode.value.value;
                        console.log('[Preprocessor] Found artDirective src:', imagePath);
                        
                        if (typeof imagePath === 'string' && !imagePath.startsWith('http') && !imagePath.startsWith('https')) {
                            const importPath = imagePath.startsWith('.') ? imagePath : './' + imagePath;
                            // Reuse component options for consistency
                            const query = buildQueryString(node, options);
                            const importId = `__img_${importCounter++}`;
                            imports.push({ id: importId, path: importPath, query });

                            // Overwrite the literal string (including quotes) with the import identifier
                            s.overwrite(exprNode.value.start, exprNode.value.end, importId);
                            console.log(`[Preprocessor] Replaced artDirective src "${imagePath}" with ${importId}`);
                        }
                    }
                }
            });
        }
      }
    }
  });

  // Add imports to the script block
  if (imports.length > 0) {
    const importStatements = imports
      .map(({ id, path, query }) => `  import ${id} from '${path}${query}';`)
      .join('\n');

    const scriptTag = ast.instance;
    if (scriptTag) {
      const scriptStart = scriptTag.content.start;
      s.appendLeft(scriptStart, importStatements + '\n');
    } else {
      s.prepend(`<script>\n${importStatements}\n</script>\n\n`);
    }
  }

  return {
    code: s.toString(),
    map: s.generateMap({ hires: true }),
  };
}

function buildQueryString(node: any, options: ImagePluginOptions): string {
  const params = new URLSearchParams();
  params.set('responsive', 'true');

  const attrs = node.attributes || [];

  const getAttrValue = (name: string) => attrs.find((a: any) => a.name === name)?.value?.[0]?.data;

  params.set('formats', getAttrValue('formats') || options.formats?.join(','));
  params.set('placeholder', getAttrValue('placeholder') || options.placeholder);
  params.set('sizes', getAttrValue('sizes'));

  // clean up null/undefined entries
  for (let [key, value] of [...params]) {
    if (value === null || value === undefined || value === 'undefined') {
      params.delete(key);
    }
  }

  const queryString = params.toString();
  return queryString ? '?' + queryString : '';
}
