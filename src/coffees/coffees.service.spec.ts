import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service'; 
import { getRepositoryToken } from '@nestjs/typeorm';
import { FlavorsEntity } from './Entities/flavors.entity';
import { Coffees } from './Entities/coffees.entity';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';


 //we can't use the real database in unit test , so we will mock the repository and affect all options with this code
type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService; //affect an instance of coffeeservice
  
  //Mocking all entities repositories
  let MockscoffeesRepository: MockRepository;
  let MocksFlavorsRepository: MockRepository;

  // Before each test , we create a testing module and get an instance of CoffeesService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeesService,
        {provide: DataSource, useValue: {}} ,
        {provide: getRepositoryToken(FlavorsEntity), useValue: createMockRepository()},
        {provide: getRepositoryToken(Coffees), useValue: createMockRepository()}
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    MockscoffeesRepository = module.get<MockRepository>(getRepositoryToken(Coffees));
    MocksFlavorsRepository = module.get<MockRepository>(getRepositoryToken(FlavorsEntity));
  });

  //test to check if the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  //test findOne
   describe("findOne", ()=>{
     describe("when coffee with ID exists", ()=>{
      it("should return the coffee object", async ()=>{
        const coffeeId = "204";
        const expectedCoffee = {id:2 , name:"Black Coffee" , brand:"Nescafe" , flavors: []};

        MockscoffeesRepository.findOne?.mockReturnValue(expectedCoffee);
      
        const coffee = await service.findOne(coffeeId);
      
        expect(coffee).toEqual(expectedCoffee);

      })
     }),
     describe("otherwise", ()=>{
      it("should throw the not found exception", async ()=>{
        const coffeeId = "204";
        MockscoffeesRepository.findOne?.mockReturnValue(null);

        
        try{
          await service.findOne(coffeeId);
        }catch(e){
          expect(e.message).toEqual(`This product is not found ${coffeeId}`);
        }
      })
     });
   })


   //test findAll
   describe("findAll",() =>{
    it("should return an array of coffes", async () =>{
      const expectedCoffees = [
        {id:1 , name:"Coffee1" , brand:"Brand1" , flavors: []},
        {id:2 , name:"Coffee2" , brand:"Brand2" , flavors: []}
      ]
      MockscoffeesRepository.find?.mockReturnValue(expectedCoffees);

      const coffees = await service.findAll({limit:10 , offset:0});
      expect(coffees).toEqual(expectedCoffees);
    })
   })

   describe("create",()=>{
     it("should create a coffes and return it", async ()=>{
      const CreateDto = {name:"Coffee1" , brand:"Brand1" , flavors: ["Flavor1" , "Flavor2"]} as any;

      //In our service , we have a method to verify if the flavor already exists before creating it , so we will mock it here
     (MocksFlavorsRepository.findOne as jest.Mock) 
      .mockReturnValueOnce({id:1 , name:"Flavor1"})
      .mockReturnValueOnce(null);
     })

     //Let's create the flavor that does not exist
      MocksFlavorsRepository.create?.mockReturnValue({id:2 , name:"Flavor2"});

      //create the coffee
      
   })
});
