import {
  Component,
  Directive,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { ConfirmationService } from 'primeng/api';

import { CustomerModalComponent } from 'src/app/views/shared/customer-modal/customer-modal.component';
import { SearchSaleCustomerModalComponent } from 'src/app/views/shared/search-sale-customer-modal/search-sale-customer-modal.component';
// import {InvoiceComponent} from "src/app/views/shared/invoice/invoice.component";

import { environment } from 'src/environments/environment';

import { CustomerService } from 'src/app/views/system/services/customer.service';
import { DocumentService } from '../services/document.service';
import { InvoiceTypeDteRepository } from '../../../core/repositories/invoice-type.repository';
import { LocationService } from 'src/app/views/expenses/services/location.service';
import { NotificationService } from 'src/app/core/helpers/notification.service';
import { ProductService } from 'src/app/views/expenses/services/product.service';
import { ResolutionService } from '../services/resolution.service';
import { SaleService } from '../services/sale.service';
import { UserService } from 'src/app/views/system/services/user.service';
import { UtilitiesService } from '../../../core/helpers/utilities.service';
import { AuthService } from '../../../core/services/auth.service';

import { Customer } from 'src/app/views/system/models/customer.model';
import { Document } from '../models/document.model';
import { Location } from 'src/app/views/expenses/models/location.model';
import { Product } from '../../../views/expenses/models/product.model';
import { Resolution } from '../models/resolution.model';
import { SaleDetail } from '../models/sale-detail.model';
import { Sale } from '../models/sale.model';
import { User } from 'src/app/views/system/models/user.model';

@Component({
  selector: 'app-sales-electronic',
  templateUrl: './sales-electronic.component.html',
  styleUrls: ['./sales-electronic.component.scss'],
})
export class SalesElectronicComponent implements OnInit, OnDestroy {
  @ViewChild(CustomerModalComponent) customerModal!: CustomerModalComponent;
  @ViewChild(SearchSaleCustomerModalComponent)
  searchSaleCustomerModal!: SearchSaleCustomerModalComponent;
  // @ViewChild(InvoiceComponent) invoiceComponent!: InvoiceComponent;
  // @ts-ignore
  saleForm: FormGroup;
  sales: Sale[] = [];
  saleId = 0;
  loading = false;
  isModalVisible = false;
  isModalErrorVisible = false;
  dteDetalle: any;
  isSaleActive = false;
  isSeeDetails = false;
  isRetry = false;
  isSelectDisabled = false;
  currentSale: Sale | null = null;
  modalTitle: string | undefined;
  subscriptions: Subscription[] = [];
  // @ts-ignore
  filteredCustomers: Customer[];
  customers: Customer[] = [];
  // @ts-ignore
  filteredProducts: Product[];
  products: Product[] = [];
  // @ts-ignore
  user: User;
  productsToSale: any[] = [];
  maxQuantity = 0;
  maxDiscount = 0;
  locations: Location[] = [];
  invoiceTypes = InvoiceTypeDteRepository;
  invoiceType = this.invoiceTypes[0].description;

  uniqueCustomer = false;
  currentDateUTCMinus6!: Date;
  maxDate!: Date;
  detainedTax = false;
  isMajorTaxpayerCustumer = false;
  isPendingPay: string | undefined;
  isSelectedCustomer = false;
  anonymousCustomer: Customer = {
    address: '',
    alias: '',
    businessName: '',
    commercialBusiness: '',
    country: 'El Salvador',
    createDate: '',
    createDateMigration: '',
    createdBy: '',
    departmentAddress: '',
    dui: '',
    email: '',
    id: 0,
    idCustomerMigration: false,
    isBusiness: false,
    isMigrated: false,
    isRetentionTax: false,
    mobile: '',
    modifiedBy: '',
    modifiedDate: '',
    municipality: '',
    name: 'Cliente anónimo',
    nit: '',
    nrc: '',
    phoneHome: '',
    phoneOffice: '',
    status: true,
  };
  // @ts-ignore
  temporalCustomer: Customer;
  // @ts-ignore
  minDate: Date;
  isViewerVisible = false;
  urlPdfBase = '';
  urlPdfDteBase = '';
  urlPdfTkt='';
  src = '';
  // @ts-ignore
  selectedSale: Sale;
  // @ts-ignore
  document: Document;
  loadingDocument = false;
  isInvoice = false;
  isValidDocument = false;
  resolutions: Resolution[] = [];
  // @ts-ignore
  invoiceForm: FormGroup;
  isCancelVisible = false;
  filteredResolutions: Resolution[] = [];
  pdfUrl: string = '';
  isDteViewerVisible: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private currencyPipe: CurrencyPipe,
    private customerService: CustomerService,
    private documentService: DocumentService,
    private fb: FormBuilder,
    private http: HttpClient,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private productService: ProductService,
    private resolutionService: ResolutionService,
    private saleService: SaleService,
    private userService: UserService,
    public utilitiesService: UtilitiesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    this.currentDateUTCMinus6 = new Date(utcNow.getTime() - 6 * 60 * 60000);

    // La fecha máxima permitida es la actual (UTC-6)
    this.maxDate = this.currentDateUTCMinus6;

    this.minDate = new Date();
    this.urlPdfBase = environment.urlPdf;
    this.urlPdfTkt = environment.urlDteTkt;
    this.urlPdfDteBase = environment.urlPdfDte;
    this.saleForm = this.fb.group({
      invoiceDate: [this.currentDateUTCMinus6],
      selectedCustomer: [null, [Validators.required]],
      location: [null, [Validators.required]],
      selectedProduct: [null],
      selectedProductStock: [null],
      selectedProductPrice: [null],
      selectedProductDiscount: [null],
      quantity: [0],
      discount: [0],
      comment: [null],
      advance: [0],
      deliveryDate: [null],
      balance: [0],
    });
    this.invoiceForm = this.fb.group({
     
      resolution: [null, Validators.required],
      invoiceNumber: [null, Validators.required],
      controlNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^DTE-\d{2}-[A-Za-z0-9]{8}-\d{15}$/),
        ],
      ],
    });

    this.customerService.getCustomers();
    this.locationService.getLocations();
    this.productService.getProducts();
    this.resolutionService.getAllResolutions();
    this.saleService.getAllSales();
    this.subscriptions[0] = this.customerService
      .selectCustomers()
      .subscribe((customers) => ([...this.customers] = customers));
    this.subscriptions[1] = this.customerService
      .selectSavedCustomer()
      .subscribe((customer) => this.updateCustomer(customer));
    this.subscriptions[2] = this.documentService
      .selectCancelledDocument()
      .subscribe((document) => this.updateDocuments(document, true));
    this.subscriptions[3] = this.documentService
      .selectIsLoading()
      .subscribe((isLoading) => (this.loadingDocument = isLoading));
    this.subscriptions[4] = this.documentService
      .selectSavedDocument()
      .subscribe((document) => this.updateDocuments(document));
    this.subscriptions[5] = this.documentService
      .selectValidateDocument()
      .subscribe((document) =>
        document
          ? (this.isValidDocument = document.is_valid_document!)
          : (this.isValidDocument = false)
      );
    this.subscriptions[6] = this.locationService
      .selectLocations()
      .subscribe((locations) => (this.locations = locations));
    this.subscriptions[7] = this.productService
      .selectProducts()
      .subscribe((products) => ([...this.products] = products));
    this.subscriptions[8] = this.resolutionService
      .selectResolutions()
      .subscribe(
        (resolutions) =>
          ([...this.resolutions] = resolutions.filter((r) => r.status === true))
      );
    this.subscriptions[9] = this.saleService
      .selectAddedSale()
      .subscribe((sale) => this.updateSalesList(sale));
    this.subscriptions[10] = this.saleService
      .selectIsLoading()
      .subscribe((isLoading) => (this.loading = isLoading));
    this.subscriptions[11] = this.saleService
      .selectSales()
      .subscribe((sales) => ([...this.sales] = sales));
    this.subscriptions[12] = this.userService
      .selectAuthenticateUser()
      .subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  newSale(): void {
    // @ts-ignore
    this.temporalCustomer = null;
    this.isSaleActive = true;
     const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    this.currentDateUTCMinus6 = new Date(utcNow.getTime() - 6 * 60 * 60000);

    // La fecha máxima permitida es la actual (UTC-6)
    this.maxDate = this.currentDateUTCMinus6;
     this.saleForm = this.fb.group({
      invoiceDate: [this.currentDateUTCMinus6],
      selectedCustomer: [null, [Validators.required]],
      location: [null, [Validators.required]],
      invoiceType: [null, Validators.required], 
      selectedProduct: [null],
      selectedProductStock: [null],
      selectedProductPrice: [null],
      selectedProductDiscount: [null],
      quantity: [0],
      discount: [0],
      comment: [null],
      advance: [0],
      deliveryDate: [null],
      balance: [0],
    });
  }

  resend(sale: Sale): void {
    // @ts-ignore

    console.log(sale);
    this.currentSale = sale;
    this.currentSale.user_id= this.authService.currentUser!.id;
    this.isSaleActive = true;
    this.isRetry = true;
    this.isSelectDisabled = true;

    this.saleForm.get('location')?.disable();


    const selectedDocument = this.invoiceTypes.find(i => i.description === sale.invoice_type);
     
    if (selectedDocument) {
      this.invoiceType = selectedDocument.description;
    }

    const selectedLocation = this.locations.find(loc => loc.name === sale.location_name);
    this.saleForm.get('location')?.setValue(selectedLocation);
    const locationId: number = this.locations.find(loc => loc.name === sale.location_name)!.id;
    this.currentSale.location_id=locationId;
    const selectedCustomer = this.customers.find(cust => cust.id === sale.customer_id);
    this.saleForm.get('selectedCustomer')?.setValue(selectedCustomer);
    const selectedInvoiceType = this.invoiceTypes.find(inv => inv.description === sale.invoice_type);
    this.saleForm.get('invoiceType')?.setValue(selectedInvoiceType);

    const products = sale.saleDetails;

    if (selectedCustomer !== undefined) {
      this.onSelectCustomer(selectedCustomer);
    }

    sale.saleDetails.forEach((detail: any) => {

      this.saleForm.get('comment')?.setValue(detail.comment);

      let productDetail = this.products.find(prod => prod.id === detail.id_item);
      if (productDetail !== undefined) {
        this.addProductToSale(productDetail,detail.quantity,detail.discount);
      }

    });

  }
    toggleErrorModal(sale? : Sale): void {
      if(sale == null){this.isModalErrorVisible = !this.isModalErrorVisible;return;}
      const url = `${environment.urlDteLogs}${sale.control_number_dte}/${sale.control_number_dte}.recepcion.response.json`;
   
    this.http.get(url).subscribe({
      next: (data) => {
        this.dteDetalle = data;
        console.log('Detalle DTE:', this.dteDetalle);
        this.isModalErrorVisible = !this.isModalErrorVisible;
      },
      error: (err) => {
        console.error('Error al obtener el DTE:', err);
      }
    });
  }
    

  getDataDocumentUrl(id: string) {
    this.http
      .get(
        'http://tipografiacerna.com/documentsbilling/notaenvio/NE' + id + '.pdf'
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  seeDetails(): void {
    this.isSeeDetails = true;
  }

  cancelSale(sale: Sale): void {
    
    const invoiceType = sale.invoice_type?.toLowerCase() ?? '';

const documentType = invoiceType.includes('nota')
  ? 'nota de envío'
  : 'factura';
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'fa-regular fa-circle-question',
      message: `¿Está seguro/a de anular la ${documentType} seleccionada?`,
      acceptLabel: 'Sí',
      accept: () => {
        this.document = {
          id_sale: sale.id,
          bill_number: sale.invoice_number.toString(10),
          bill_type: sale.invoice_type,
          status: sale.invoice_status,
          is_canceled: false,
          control_number: sale.control_number_dte,
        };
        this.toggleCancel(this.document);
      },
    });
  }

  paySale(sale: Sale): void {
    sale.is_pending = false;
    this.saleService.paySale(sale);
    this.returnSalesList(false);
  }

  /**
   * Clean all information, return to sale list and get all sales (optional)
   * @param needRefreshList Flag indicates if prefer get all sales
   */
  returnSalesList(needRefreshList: boolean = true): void {
    this.isSaleActive = false;
    this.isRetry = false;
    this.currentSale = null;
    this.saleForm.get('location')?.enable();
    this.isSelectDisabled = false;
    this.currentSale = null;
    this.isSeeDetails = false;
    this.saleForm.reset();
    this.invoiceType = this.invoiceTypes[1].description;
    this.productsToSale = [];
    this.uniqueCustomer = false;
    this.detainedTax = false;
    this.maxQuantity = 0;
    this.maxDiscount = 0;
    this.isSelectedCustomer = false;
    this.saleForm.controls['comment']?.clearValidators();
    this.saleForm.controls['comment']?.updateValueAndValidity();
    this.saleForm.reset();
    if (needRefreshList) {
      this.saleService.getAllSales();
    }
  }

  filterCustomer(event: any): void {
    const query = event.query;
    this.filteredCustomers =
      query.trim().length > 0
        ? this.customers.filter(
          (c) =>
            c.name
              .trim()
              .toLowerCase()
              .includes(query.trim().toLowerCase()) && c.status
        )
        : [];
  }

  filterProduct(event: any): void {
    let index = 0;
    const query = event.query;

    if (query.trim().length > 0) {
      const previousFilter = this.products.filter(
        (p) =>
          p.description
            .trim()
            .toLowerCase()
            .includes(query.trim().toLowerCase()) && p.stock > 0
      );

      this.filteredProducts = previousFilter;
    } else {
      this.filteredProducts = [];
    }
  }

  saveNewCustomer(customer: Customer): void {
    this.customerService.createCustomer(customer);
  }

  onSelectProduct(product: Product): void {
    this.saleForm.patchValue({
      selectedProductStock: product.stock,
      selectedProductPrice: this.currencyPipe.transform(
        product.sale_price,
        'USD'
      ),
      selectedProductDiscount: this.currencyPipe.transform(
        product.discount,
        'USD'
      ),
    });
    this.maxQuantity = product.stock;
    this.maxDiscount = product.sale_price - 0.01;
  }

  onClearProduct(): void {
    const customer = this.saleForm.controls['selectedCustomer'].value;
    const comment = this.saleForm.controls['comment'].value;
    const advance = this.saleForm.controls['advance'].value;
    const deliveryDate = this.saleForm.controls['deliveryDate'].value;
    const balance = this.saleForm.controls['balance'].value;
    const location = this.saleForm.controls['location'].value;
    const invoiceDate = this.saleForm.controls['invoiceDate'].value;
    this.saleForm.reset();
    this.saleForm.patchValue({
      invoiceDate:invoiceDate,
      selectedCustomer: customer,
      comment: comment,
      advance: advance,
      deliveryDate: deliveryDate,
      balance: balance,
      location: location,
    });
    this.maxQuantity = 0;
    this.maxDiscount = 0;
  }

  isProductValidToAdd(): boolean {
    const selectedProduct = this.saleForm.controls['selectedProduct'].value;
    const quantity = this.saleForm.controls['quantity'].value;

    if (selectedProduct === null) {
      return false;
    }

    if (quantity === null) {
      return false;
    }

    return !(quantity <= 0 || quantity > this.maxQuantity);
  }

  haveDiscount(): boolean {
    const discount = this.saleForm.controls['discount'].value;

    return discount > 0;
  }

  addProductToSale(newProduct?: Product, newQuantity?: number, newDiscount?: number): void {

    let selectedProduct = undefined;
    let _newQuantity = undefined;
    let _newDiscount = undefined;
    if (newProduct !== undefined) {
      selectedProduct = newProduct;
      _newQuantity = newQuantity;
      _newDiscount = newDiscount;
    }
    else {
      selectedProduct = this.saleForm.controls['selectedProduct'].value;
      _newQuantity = this.saleForm.controls['quantity'].value;
      _newDiscount = this.saleForm.controls['discount'].value;
    }

    const product = {
      id: selectedProduct.id,
      brand_code: selectedProduct.brand_code,
      company_code: selectedProduct.company_code,
      distributor_code: selectedProduct.company_code,
      internal_code: selectedProduct.internal_code,
      barcode: selectedProduct.barcode,
      description: selectedProduct.description,
      stock: selectedProduct.stock,
      minimum_stock: selectedProduct.minimum_stock,
      reservation: selectedProduct.reservation,
      cost: selectedProduct.cost,
      price: selectedProduct.sale_price,
      wholesale_price: selectedProduct.wholesale_price,
      quantity: _newQuantity,
      discount:
        _newDiscount === null
          ? 0
          : _newDiscount,
      category_id: selectedProduct.category_id,
      provider_id: selectedProduct.provider_id,
      location_id: selectedProduct.location_id,
      validQuantity: this.saleForm.controls['quantity'].value,
      validDescription: selectedProduct.description,
      validDiscount:
        this.saleForm.controls['discount'].value === null
          ? 0
          : this.saleForm.controls['discount'].value,
      is_exempt_product: selectedProduct.is_exempt_product,
    };

    this.productsToSale.push(product);
    this.productsToSale = [...this.productsToSale];
    this.notificationService.info('¡Se agregó el producto correctamente!');
    this.verifyCommentAndDiscount();
    this.onClearProduct();
  }

  getTotalSale(): number {
    let total = 0;
    this.productsToSale.forEach((product) => {
      if (!product.is_exempt_product) {
        total = total + product.quantity * (product.price - product.discount);
      }
    });
    return parseFloat(total.toFixed(2));
  }

  getTotalTax(): number {
    let taxableAmount = 0;

    // Only calculate tax on non-exempt products when there's no tax detention
    this.productsToSale.forEach((product) => {
      if (!product.is_exempt_product) {
        const productTotal =
          product.quantity * (product.price - product.discount);
        taxableAmount += productTotal;
      }
    });

    // Calculate tax only on the taxable amount
    const tax =
      taxableAmount - taxableAmount / this.utilitiesService.getTaxWithInteger();
    return parseFloat(tax.toFixed(2));
  }

  getSubTotalSale(): number {
    // Calculate subtotal (total without tax)
    let subtotal = 0;

    this.productsToSale.forEach((product) => {
      const productTotal =
        product.quantity * (product.price - product.discount);

      if (!product.is_exempt_product) {
        // For taxable products, divide by tax factor to get subtotal
        subtotal += productTotal / this.utilitiesService.getTaxWithInteger();
      }
    });

    return parseFloat(subtotal.toFixed(2));
  }

  getTotalSaleExent(): number {
    // Calculate subtotal (total without tax)
    let subtotal = 0;

    this.productsToSale.forEach((product) => {
      const productTotal =
        product.quantity * (product.price - product.discount);

      if (product.is_exempt_product) {
        // For taxable products, divide by tax factor to get subtotal
        subtotal += productTotal ;
      }
    });

    return parseFloat(subtotal.toFixed(2));
  }

  removeProduct(product: any): void {
    this.productsToSale = this.productsToSale.filter(
      (p) => p.id !== product.id
    );
    this.notificationService.info('¡Se eliminó el producto correctamente!');
  }

  isValidToSale(): boolean {
    return (
      this.productsToSale.length > 0 &&
      this.saleForm.controls['location'].value !== null &&
      this.saleForm.controls['selectedCustomer'].value !== null &&
      this.saleForm.controls['comment'].valid &&
      (this.invoiceType != null || this.invoiceType != undefined)
    );
  }

  onEditQuantity(product: any): void {
    if (product.quantity <= 0) {
      product.quantity = product.validQuantity;
      this.notificationService.warning(
        '¡La cantidad no puede ser menor o igual a cero!'
      );
      return;
    }

    if (product.quantity > product.stock) {
      product.quantity = product.validQuantity;
      this.notificationService.warning(
        `¡La cantidad no puede ser mayor a ${product.stock}!`
      );
      return;
    }

    product.validQuantity = product.quantity;
    this.notificationService.info('¡Se editó la cantidad correctamente!');
  }

  onEditDiscount(product: any): void {
    if (product.discount < 0) {
      product.discount = product.validDiscount;
      this.notificationService.warning(
        '¡El descuento no puede ser menor a cero!'
      );
      return;
    }

    if (product.discount > product.price - 0.01) {
      product.discount = product.validDiscount;
      this.notificationService.warning(
        '¡El descuento no puede ser mayor a ${product.price}!'
      );
      return;
    }

    product.validDiscount = product.discount;
    this.notificationService.info('¡Se editó el descuento correctamente!');
  }

  onEditDescription(product: any): void {
    if (product.description.trim().length <= 3) {
      product.description = product.validDescription;
      this.notificationService.warning(
        '¡La descripción debe tener al menos tres caracteres!'
      );
      return;
    }

    product.validDescription = product.description;
    this.notificationService.info('¡Se editó la descripción correctamente!');
  }

  /**
   * Complete the sale process
   */
  completeSale(): void {
   
    let new_sale = this.buildSale();
    if(this.currentSale !== null && this.isRetry)
    {
      //se llena el tipo de factura en dado caso sea un reintento, ya que si no se hace se toma la primer opción
      this.invoiceType = this.currentSale.invoice_type ?? '';
      //se llenan estos campos ya que existe la posibilidad de agregar mas productos si es un reintento
      this.currentSale.invoice_total_letters = new_sale.invoice_total_letters;
      this.currentSale.invoice_total = new_sale.invoice_total;
      this.currentSale.sub_total_sale = new_sale.sub_total_sale;
      this.currentSale.total_sale = new_sale.total_sale;
      this.currentSale.tax_credit_sale = new_sale.tax_credit_sale;
      this.currentSale.tax_non_credit_sale = new_sale.tax_non_credit_sale;
      this.currentSale.tax_reteined = new_sale.tax_reteined;
      this.currentSale.tax_perceived = new_sale.tax_perceived;
      this.currentSale.tax_sale = new_sale.tax_sale;
      this.currentSale.saleDetails = new_sale.saleDetails;
      this.currentSale.is_retry = true;
      new_sale = this.currentSale;
    }
    this.temporalCustomer = this.saleForm.controls['selectedCustomer'].value;

    switch (this.invoiceType?.trim().toLowerCase()) {
      case 'credito fiscal':
        this.saleService.addSaleTaxCreditDte(new_sale);
        this.notificationService.success('¡Venta realizada exitosamente!');
        this.returnSalesList(false);
        break;
      case 'consumidor final':
        this.saleService.addSaleInvoiceDte(new_sale);
        this.notificationService.success('¡Venta realizada exitosamente!');
        this.returnSalesList(false);
        break;
      default:
        this.notificationService.warning(
          '¡No es posible procesar el tipo de documento seleccionado!'
        );
        break;
    }
  }

  updateSalesList(sale: Sale): void {
    if (sale) {
      const sales = [...this.sales];
      if (this.temporalCustomer != undefined) {
        sale.business_name =
          this.temporalCustomer.businessName == null
            ? ''
            : this.temporalCustomer.businessName;
        sale.commercial_business =
          this.temporalCustomer.commercialBusiness == null
            ? ''
            : this.temporalCustomer.commercialBusiness;
      }
      sales.push(sale);
      this.saleService.updateSales(sales);
    }
  }

  buildSale(): Sale {

    const date = this.saleForm.controls['invoiceDate'].value;
    const deliveryDate = this.saleForm.controls['deliveryDate'].value;
    const location = this.saleForm.controls['location'].value;
    const saleDetails: SaleDetail[] = [];
    this.productsToSale.forEach((product) => {
      let affected_sale = 0;
      let exception_sale = 0;
      if (!product.is_exempt_product && !this.detainedTax) {
        affected_sale = this.utilitiesService.getCurrencyWithoutTax(
          product.price * product.quantity
        );
      }
      if (product.is_exempt_product || this.detainedTax) {
        exception_sale = this.utilitiesService.getCurrencyWithoutTax(
          product.price * product.quantity
        );
      }
      saleDetails.push({
        affected_sale: affected_sale,
        created_at: this.utilitiesService.formatDate(date),
        description_item: product.description,
        discount: product.discount,
        exception_sale: exception_sale,
        id: 0,
        id_item: product.id,
        id_sale: 0,
        location: product.location_id,
        non_tax_sale: 0,
        quantity: product.quantity,
        unit_price: product.price - product.discount,
        unit_price_non_tax: this.utilitiesService.getCurrencyWithoutTax(
          product.price - product.discount
        ),
        updated_at: this.utilitiesService.formatDate(date),
      });
    });
    const customer: Customer = this.saleForm.controls['selectedCustomer'].value;
    
    return {
      active: true,
      advance_payment: this.saleForm.controls['advance'].value,
      balance_payment: this.saleForm.controls['balance'].value,
      comment: this.saleForm.controls['comment'].value,
      created_at: this.utilitiesService.formatDate(date),
      customer_id: customer.id,
      date_delivery:
        deliveryDate === null
          ? null
          : this.utilitiesService.formatDate(deliveryDate),
      exception_sale: this.getTotalSaleExent(),
      id: 0,
      invoice_number: 0,
      invoice_status: 'Ingresada',
      invoice_total:
        this.getTotalSale() -
        this.getDetainedTax() +
        this.getTotalSaleExent() +
        this.getCollectedTax(),
      invoice_total_letters: this.utilitiesService.convertNumberToWords(
        this.getTotalSale() -
        this.getDetainedTax() +
        this.getTotalSaleExent() +
        this.getCollectedTax()
      ),
      invoice_type: this.invoiceType,
      is_invoice_detained: this.detainedTax,
      is_pending: this.getPendingPay(),
      is_pending_pay: this.getPendingPayDesc(),
      location_id: location.id,
      number_resolution_tax: null,
      saleDetails: saleDetails,
      sub_total_sale: this.getTotalSale() - this.getDetainedTax(),
      tax_credit_sale: 0,
      tax_non_credit_sale: 0,
      tax_perceived: this.getCollectedTax(),
      tax_reteined: this.getDetainedTax(),
      tax_sale: this.getTotalTax(),
      total_sale:
        this.getTotalSale() -
        this.getDetainedTax() +
        this.getTotalSaleExent() +
        this.getCollectedTax(),
      updated_at: this.utilitiesService.formatDate(date),
      user_id: this.authService.currentUser!.id,
      is_retry: this.isRetry
    };
  }

  getBalance(): void {
    const advance = parseFloat(this.saleForm.controls['advance'].value);
    const total = this.getTotalSale();
    if (advance > total || advance <= 0) {
      this.saleForm.patchValue({ advance: 0 });
    } else {
      this.saleForm.patchValue({ balance: total - advance });
    }
  }

  changeUniqueCustomer(event: any): void {
    this.uniqueCustomer = event.target.checked;
    if (this.uniqueCustomer) {
      this.isSelectedCustomer = false;
      this.temporalCustomer = this.saleForm.controls['selectedCustomer'].value;
      this.saleForm.patchValue({ selectedCustomer: this.anonymousCustomer });
    } else {
      this.saleForm.patchValue({ selectedCustomer: this.temporalCustomer });
      this.isSelectedCustomer = this.temporalCustomer !== null;
    }
  }

  getPendingPayDesc(): string {
    if (this.isPendingPay) {
      return 'Pendiente de Pago';
    } else {
      return 'Pagado';
    }
  }

  getPendingPay(): boolean {
    return !!this.isPendingPay;
  }

  verifyCommentAndDiscount(): void {
    let haveDiscount = false;
    this.productsToSale.every((product) => {
      if (product.discount > 0) {
        haveDiscount = true;
        return false;
      } else {
        return true;
      }
    });
    if (haveDiscount) {
      this.saleForm.controls['comment'].addValidators([
        Validators.required,
        Validators.minLength(3),
      ]);
    } else {
      this.saleForm.controls['comment'].clearValidators();
    }
  }

  changeInvoiceType(): void {
    this.uniqueCustomer = false;
  }

  updateCustomer(customer: Customer): void {
    if (customer) {
      const index = this.customers.findIndex((c) => c.id === customer.id);

      const customers = [...this.customers];
      if (index < 0) {
        customers.push(customer);
        this.customerService.updateCustomers(customers);
        this.saleForm.patchValue({ selectedCustomer: customer });
      }
    }
  }

isFinalConsumer(): boolean {
  return this.invoiceType
    ?.toLowerCase()
    .includes('consumidor') ?? false;
}

isFiscalCredit(): boolean {
  return this.invoiceType
    ?.toLowerCase()
    .includes('fiscal') ?? false;
}

  isDeliveryNote(): boolean {
    return false;
  }

  getColSpan(): number {
    return 8;
  }

  getSaleAffect(
    price: number,
    discount: number,
    quantity: number,
    product: Product
  ): number {
    if (!quantity) quantity = 1;
    if (!product.is_exempt_product) {
      return this.utilitiesService.getCurrencyWithoutTax(
        (price - discount) * quantity
      );
    }
    return 0;
  }

  getSaleExent(
    price: number,
    discount: number,
    quantity: number,
    product: Product
  ): number {
    if (!quantity) quantity = 1;
    if ( product.is_exempt_product) {
      return (price - discount) * quantity
      ;
    }
    return 0;
  }

  handleViewerChange(event: boolean): void {
    this.isViewerVisible = event;
    if (!this.isViewerVisible) {
      if (this.isInvoice && this.isValidDocument) {
        this.confirmationService.confirm({
          header: 'Confirmación',
          icon: 'fa-regular fa-circle-question',
          message: '¿Se imprimió la factura correctamente?',
          acceptLabel: 'Sí',
          accept: () => {
            this.documentService.saveDocument(this.document);
            // @ts-ignore
            this.document = null;
          },
        });
      }
      setTimeout(() => {
        // @ts-ignore
        this.selectedSale = null;
        this.isValidDocument = false;
        this.invoiceForm.reset();
      }, 500);
    }
  }

  handleCancelChange(event: boolean): void {
    this.isCancelVisible = event;
    if (!this.isCancelVisible) {
      // @ts-ignore
      this.document = null;
      this.invoiceForm.reset();
    }
  }

  toggleViewer(sale: Sale | null = null): void {
    this.isViewerVisible = !this.isViewerVisible;
const invoiceType = sale?.invoice_type?.toLowerCase() ?? '';

    if (this.isViewerVisible && sale != null) {
      if (invoiceType.trim().toLowerCase().includes('final')) {
        this.src = `${this.urlPdfBase}/CF${sale.id}.pdf`;
      } else if (invoiceType.trim().toLowerCase().includes('fiscal')) {
        this.src = `${this.urlPdfBase}/CCF${sale.id}.pdf`;
      } else {
        this.src = `${this.urlPdfBase}/NE${sale.id}.pdf`;
      }
      this.selectedSale = sale;
      this.isInvoice = !invoiceType.trim().toLowerCase().includes('nota');
      if (this.resolutions.length > 0) {
        let defaultResolution = undefined;
        if (invoiceType.trim().toLowerCase().includes('final')) {
          defaultResolution = this.resolutions.find((r) =>
            r.bill_type.trim().toLowerCase().includes('final')
          );
          this.getFilteredResolutions('final');
        } else if (invoiceType.trim().toLowerCase().includes('fiscal')) {
          defaultResolution = this.resolutions.find((r) =>
            r.bill_type.trim().toLowerCase().includes('fiscal')
          );
          this.getFilteredResolutions('fiscal');
        }
        if (defaultResolution === undefined) {
          defaultResolution = this.resolutions[0];
        }
        this.invoiceForm.patchValue({
          resolution: defaultResolution,
        });
      }
    }
  }

  toggleCancel(document: Document | null = null): void {
    this.isCancelVisible = !this.isCancelVisible;

    if (this.isCancelVisible) {
      if (this.resolutions.length > 0) {
        let defaultResolution = undefined;
        if (document!.bill_type!.trim().toLowerCase().includes('final')) {
          defaultResolution = this.resolutions.find((r) =>
            r.bill_type.trim().toLowerCase().includes('final')
          );
          this.getFilteredResolutions('final');
        } else if (
          document!.bill_type!.trim().toLowerCase().includes('fiscal')
        ) {
          defaultResolution = this.resolutions.find((r) =>
            r.bill_type.trim().toLowerCase().includes('fiscal')
          );
          this.getFilteredResolutions('fiscal');
        }
        if (defaultResolution === undefined) {
          defaultResolution = this.resolutions[0];
        }
        this.invoiceForm.patchValue({
          resolution: defaultResolution,
        });
      }
      this.document = document!;
    }
  }

  getFilteredResolutions(type: string): void {
    this.filteredResolutions = this.resolutions.filter((r) =>
      r.bill_type.trim().toLowerCase().includes(type)
    );
  }

  validateInvoiceNumber(): void {
    this.document = {
      id_sale: this.selectedSale.id,
      resolution_number:
        this.invoiceForm.controls['resolution'].value.resolution_number,
      resolution_number_cu:
        this.invoiceForm.controls['resolution'].value.resolution_number_cu,
      bill_number: this.invoiceForm.controls['invoiceNumber'].value,
      bill_type: this.selectedSale.invoice_type,
      status: this.selectedSale.invoice_status,
      is_canceled: false,
      user_id: this.authService.currentUser!.id,
    };
    this.documentService.validateDocument(this.document);
  }

  processCancel(): void {
    
    if (
      this.invoiceForm.controls['controlNumber'].value ===
      this.document.control_number
    ) {
      this.documentService.cancelDocumentDte({
        idSale: this.document.id_sale,
        controlNumber: this.invoiceForm.controls['controlNumber'].value,
        userId: this.authService.currentUser?.id,
      });
      this.toggleCancel();
      this.returnSalesList();
    } else {
      this.notificationService.warning('¡Numero de control invalido!');
    }
  }

  updateDocuments(document: Document, cancel = false): void {
    if (document) {
      const index = this.sales.findIndex((s) => s.id === document.id_sale);
      const sales = [...this.sales];
      const sale = { ...sales[index] };
      if (!cancel) {
        sale.invoice_number = parseInt(document.bill_number!, 10);
        sale.invoice_status = document.status!;
      } else {
        sale.invoice_status = 'Cancelada';
      }
      sales[index] = sale;
      this.saleService.updateSales(sales);
    }
  }

  onSelectCustomer(customer: Customer): void {
    this.detainedTax = customer.isRetentionTax!;
    this.isSelectedCustomer = true;
    this.isMajorTaxpayerCustumer = customer.isMajorTaxpayer!;
  }
canShowRow(): boolean {
  return this.isSelectedCustomer &&
         this.isValidInvoiceType() &&
         !!this.saleForm.get('location')?.value;
}
isValidInvoiceType(): boolean {
  return this.invoiceType === 'Consumidor Final'
      || this.invoiceType === 'Credito Fiscal';
}
  onClearCustomer(): void {
    this.detainedTax = false;
    this.isSelectedCustomer = false;
    this.saleForm.patchValue({ selectedCustomer: null });
  }

  getDetainedTax(): number {
    if (
      
      this.getTotalSale() >= environment.taxes.minimumWithHoldingValue
    ) {
      const customer = this.saleForm.controls['selectedCustomer'].value;
      if (customer === null) {
        return 0;
      }
      if (customer.isRetentionTax) {
        return parseFloat(
          (
            (this.getTotalSale() / this.utilitiesService.getTaxWithInteger()) *
            this.utilitiesService.getTaxWithHeld()
          ).toFixed(2)
        );
      }
      return 0;
    }
    return 0;
  }

  getCollectedTax(): number {
    let taxableAmount = 0;
    let tax = 0;
    if (this.isMajorTaxpayerCustumer) {
      this.productsToSale.forEach((product) => {
        const productTotal =
          product.quantity * (product.price - product.discount);
        if (!product.is_exempt_product && !this.detainedTax) {
          taxableAmount +=
            productTotal / this.utilitiesService.getTaxWithInteger();
        }
      });
      // Calculate tax only on the taxable amount
      tax =
        taxableAmount -
        taxableAmount / this.utilitiesService.getTaxCollectedInteger();
    }
    return parseFloat(tax.toFixed(2));
  }

  loadSelectedSale(sale: Sale): void {
    let count = 0;
    sale.saleDetails.forEach((detail) => {
      if (
        this.productsToSale.findIndex(
          (product) =>
            detail.description_item.toLowerCase() ===
            product.description.toLowerCase()
        ) === -1
      ) {
        const product = {
          id: detail.id_item,
          brand_code: '',
          company_code: '',
          distributor_code: '',
          internal_code: '',
          barcode: '',
          description: detail.description_item,
          stock: 0,
          minimum_stock: 0,
          reservation: 0,
          cost: 0,
          price: detail.unit_price,
          wholesale_price: 0,
          quantity: detail.quantity,
          discount: detail.discount,
          category_id: 0,
          provider_id: 0,
          location_id: 0,
          validQuantity: detail.quantity,
          validDescription: detail.description_item,
          validDiscount: detail.discount,
        };

        this.productsToSale.push(product);
        count++;
      }
    });

    if (count > 0) {
      this.productsToSale = [...this.productsToSale];
      this.notificationService.info(
        '¡Se agregaron los productos de la venta seleccionada correctamente!'
      );
      this.verifyCommentAndDiscount();
      this.onClearProduct();
    } else {
      this.notificationService.warning(
        '¡Al parecer los productos seleccionados ya se encuentran agregados!'
      );
    }
  }

  openDtePdf(sale: Sale): void {
    // Aquí puedes construir la URL al PDF del DTE según los datos de la venta

    // Supongamos que el número de control del DTE está en sale.invoice_number
    const codeGeneration = sale.code_generation_dte;

    // Construir la URL al PDF (ajusta esto según la estructura real de la URL)
    this.pdfUrl = this.urlPdfDteBase + `/${codeGeneration}.pdf`;

    // Mostrar la modal
    this.isDteViewerVisible = true;
  }
  
  openTktDtePdf(sale: Sale): void {
    // Aquí puedes construir la URL al PDF del DTE según los datos de la venta

    // Supongamos que el número de control del DTE está en sale.invoice_number
    const codeGeneration = sale.code_generation_dte;

    // Construir la URL al PDF (ajusta esto según la estructura real de la URL)
    this.pdfUrl = this.urlPdfTkt + `/TKT${codeGeneration}.pdf`;

    // Mostrar la modal
    this.isDteViewerVisible = true;
  }

  // Añadir esta función para cerrar la modal
  closeDteViewer(): void {
    this.isDteViewerVisible = false;
    this.pdfUrl = '';
  }

  // Añadir esta función para manejar el cambio de visibilidad
  handleDteViewerChange(event: boolean): void {
    this.isDteViewerVisible = event;
    if (!this.isDteViewerVisible) {
      this.pdfUrl = '';
    }
  }

  /**
   * Open the JSON file in new tab
   * @param sale An object of Sale
   * @see Sale
   */
  downloadDteJson(sale: Sale): void {
    this.utilitiesService.downloadFile(
      this.urlPdfDteBase,
      sale.code_generation_dte
    );
  }

  /**
   * Send invoice to the customer email
   * @param sale An object of Sale
   * @see Sale
   */
  sendEmail(sale: Sale): void {
    this.confirmationService.confirm({
      header: 'Confirmación',
      icon: 'fa-regular fa-circle-question',
      message: `¿Está segur@ de enviar la factura al correo electronico del cliente?`,
      acceptLabel: 'Sí',
      accept: () => {
        this.saleService.addSendEmailDte({
          idSale: sale.id,
          idCustomer: sale.customer_id,
          codeGeneration: sale.code_generation_dte,
        });
      },
    });
  }
}
