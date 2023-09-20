# ExecutionContext Nest切换不同上下文

Nest支持创建HTTP服务、WebSocket服务，还有基于TCP通信的微服务

不同类型的服务能拿到的参数是不同的，比如http服务可以拿到request、response对象，而ws服务就没有，让Guard、Interceptor、Exception Filter跨多种上下文复用，Nest给出的解决方案是ArgumentHost和ExceptionContext类

ArgumentHost 是用于切换 http、ws、rpc 等上下文类型的，可以根据上下文类型取到对应的 argument。

```ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AaaException } from './AaaException';

@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    if(host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response
        .status(500)
        .json({
          aaa: exception.aaa,
          bbb: exception.bbb
        });
    } else if(host.getType() === 'ws') {

    } else if(host.getType() === 'rpc') {

    }
  }
}
```

ExecutionContext 是 ArgumentHost 的子类，扩展了 getClass、getHandler 方法。

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from './role';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AaaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user && user.roles?.includes(role));
  }
}
```
