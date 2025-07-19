import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { CompanyService } from "./company.service";
import { AuthGuard } from "@nestjs/passport";
import { Company } from "./entities/company.entity";
import { createCompanyDto } from "./dto/company.dto";

@ApiTags('company')
@Controller({path:'company'})
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class CompanyController {
    constructor(
        private readonly CompanyService: CompanyService
    ){}
    @Get()
    async getAllCompanies() :Promise<Company[]> {
        return await this.CompanyService.findAll()
    }
    @Post()
    async create(@Body() payload:createCompanyDto) {
        return await this.CompanyService.create(payload)
    }
    @Get('/:companyId')
    @ApiParam({
        name: 'companyId',
        description: 'Company ID',
    })
    async getCompanyById(@Param('companyId') companyId:string): Promise<Company> {
        return await this.CompanyService.findById(Number(companyId))
    }
}