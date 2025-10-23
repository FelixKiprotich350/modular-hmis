import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FieldSelector = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resversion = request.query.resversion || 'default';
    const fields = request.query.fields;
    
    if (resversion === 'full') {
      return { type: 'full' };
    }
    
    if (resversion === 'custom' && fields) {
      const fieldArray = fields.split(',').map((field: string) => field.trim());
      const selectObject: any = {};
      
      fieldArray.forEach((field: string) => {
        if (field.includes('.')) {
          const parts = field.split('.');
          let current = selectObject;
          
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
              current[parts[i]] = { select: {} };
            }
            current = current[parts[i]].select;
          }
          current[parts[parts.length - 1]] = true;
        } else {
          selectObject[field] = true;
        }
      });
      
      return { type: 'custom', data: selectObject };
    }
    
    return { type: 'default' };
  },
);