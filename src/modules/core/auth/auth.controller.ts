import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from "@nestjs/swagger";
import { AuthService } from "./services/auth.service";
import { PrismaService } from "../../../core/prisma.service";
import { AuthGuard } from "../../../core/guards/auth.guard";
import { User } from "../../../core/decorators/user.decorator";
import { LoginDto } from './dto/login.dto';

@ApiTags("Auth")
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private authService: AuthService;

  constructor(private prisma: PrismaService) {
    this.authService = new AuthService(prisma);
  }

  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() loginDto: LoginDto,
    @Headers() headers: any,
    @Req() req: any
  ) {
    const result = await this.authService.login(loginDto, {
      ip: req.ip,
      userAgent: headers["user-agent"],
    });
    if (!result) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    return result;
  }

  @Post("logout")
  @ApiOperation({ summary: "User logout" })
  @ApiHeader({ name: "Authorization", description: "Bearer token" })
  async logout(@Headers("authorization") token: string) {
    await this.authService.logout(token);
    return "Logout successful";
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({ status: 200, description: "Current user info" })
  async getCurrentUser(@User() user: any) {
    return user;
  }
}
