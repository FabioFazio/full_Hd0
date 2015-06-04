<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 */
class Department {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255) */
	protected $name;
	
	/** @ORM\ManyToOne(targetEntity="User") */
	protected $manager;
	
	/** @ORM\ManyToOne(targetEntity="Store", inversedBy="departments")
	 *  @ORM\JoinColumn(name="store_id", referencedColumnName="id")
	 */
	protected $store;
	
	/** @ORM\OneToMany(targetEntity="Sector", mappedBy="department") */
	protected $sectors;
	
	/** @ORM\Column(type="boolean") */
	protected $disabled;
	
	public function __construct(){
		$this->sectors = new ArrayCollection();
		$this->disabled = false;
	}
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function getStore(){
    	return $this->store;
    }
    
    public function setStore($store){
    	$this->store = $store;
    }
    
    public function getManager(){
    	return $this->manager;
    }
    
    public function setManager($manager){
    	$this->manager = $manager;
    }

    public function hasSectors() {
    	return $this->sectors->count();
    }
    
    public function getSectors() {
    	return $this->sectors;
    }
    
    public function isDisabled(){
    	return $this->disabled?:false;
    }
    
    public function setDisabled($disabled){
    	$this->disabled = $disabled;
    }
    
    public function getFullname(){
    	$sto        = $this->getStore()?$this->getStore()->getName():'';
    	$fullname   = $sto?$sto.' - '.$this->getName():$this->getName();
    	return $fullname;
    }
    
    public function toArray()
    {
    	$array = get_object_vars($this);
    
    	$scs = [];
    	foreach($this->getSectors()->toArray() as $sc){
    	    if(!$sc->isDisabled())
        		$scs[$sc->getId()] = $sc->toArray();
    	}
    	$array['sectors'] = $scs;
    
    	$array['store_id'] = $this->getStore()?$this->getStore()->getId():null;
    	unset($array['store']);
    	
    	$array['manager_id'] = $this->getManager() && !$this->getManager()->isDisabled()?
    	       $this->getManager()->getId():null;
    	$array['manager'] = $this->getManager()  && !$this->getManager()->isDisabled()?
    	       $this->getManager()->getFullname():"";
    	
    	$array['fullname'] = $this->getFullname();
    
    	return $array;
    }
}