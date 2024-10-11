import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiModelOkResponse } from 'src/common/swagger/ok-response.swagger';
import { PaginationDoc } from 'src/common/swagger/pagination.swagger';

import { CreateSupportDto } from './dto/create-support.dto';
import { Support, SupportDocument } from './entity/support';
import { SupportService } from './support.service';

@ApiTags('Support (User)')
@Controller('/user/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('/')
  @PaginationDoc()
  @ApiModelOkResponse(Support)
  async createSupport(
    @Body() createSupportDto: CreateSupportDto,
  ): Promise<SupportDocument> {
    return this.supportService.create(createSupportDto);
  }
}
